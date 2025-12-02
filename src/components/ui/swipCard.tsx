import { ChevronDown, ChevronUp } from 'lucide-react-native';
import React, { useCallback, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Dimensions,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useThemeColors } from '../../utils/ColorTheme';
import Config from 'react-native-config';
import {
  useAddSecondaryStock,
  useSellSecondaryStock,
} from '../../services/portfolio';
import { Table, Row, Rows } from 'react-native-table-component';

import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import StockModal from './StockModal';

const SWIPE_THRESHOLD = 90;
const ANIMATION_DURATION = 200;
const SCREEN_WIDTH = Dimensions.get('window').width;

const StockTable = ({ stockListData }) => {
  // Table headers
  const tableHead = ['Name', 'Qty', 'P/L', 'Buy Price'];

  // Map multidata into rows
  const tableData = stockListData?.map(item => [
    item.user_name,
    item.quantity,
    item.unreal_gain !== undefined ? Number(item.unreal_gain).toFixed(2) : '-',
    item.buyPrice,
  ]);

  // Calculate dynamic height based on number of rows
  const tableHeight = Math.min((tableData?.length || 0) * 40 + 40, 300); // 40px per row + header, max 300px

  console.log('table prop', stockListData);
  console.log('table data', tableData);

  return (
    <ScrollView
      horizontal={true}
      style={{ maxHeight: tableHeight }}
      contentContainerStyle={{ minWidth: '100%' }}
      showsHorizontalScrollIndicator={false}
    >
      <View style={{ width: SCREEN_WIDTH * 0.9, minWidth: 280 }}>
        <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
          <Row
            widthArr={[100, 60, 70, 90]}
            data={tableHead}
            style={styles.head}
            textStyle={styles.tableText}
          />
          <Rows
            widthArr={[100, 60, 70, 90]}
            data={tableData}
            textStyle={styles.tableText}
          />
        </Table>
      </View>
    </ScrollView>
  );
};

export interface GraphDatatypes {
  t: number;
  c: number;
}

export interface Stock {
  id: number;
  symbol: string;
  ltp: number;
  quantity: number;
  change: number;
  heatmap?: number[];
  graph: GraphDatatypes[];
  multi?: boolean;
  multidata?: any[];
}

export interface StockListProps {
  stockList: Stock[];
}

type RowRef = {
  close: () => void;
};

//  Swipeable row
const SwipeableRow = ({
  isOpen,
  onOpen,
  refCallback,
  stockListData,
}: {
  isOpen: boolean;
  onOpen: (id: string) => void;
  refCallback: (id: string, ref: RowRef) => void;
  stockListData: Stock;
}) => {
  const translateX = useSharedValue(0);
  const { colors } = useThemeColors();

  console.log('stocklistdta,', stockListData);
  const close = () => {
    translateX.value = withTiming(0, { duration: ANIMATION_DURATION });
  };

  // Register row ref
  React.useEffect(() => {
    refCallback(stockListData.id, { close });
  }, []);

  React.useEffect(() => {
    if (!isOpen) {
      close();
    }
  }, [isOpen]);

  // Pan gesture
  const panGesture = Gesture.Pan()
    .activeOffsetX([-2, 2])
    .failOffsetY([-60, 60])
    .onUpdate(e => {
      translateX.value = e.translationX;
    })
    .onEnd(e => {
      if (e.translationX > SWIPE_THRESHOLD) {
        translateX.value = withTiming(SWIPE_THRESHOLD, {
          duration: ANIMATION_DURATION,
        });
        runOnJS(onOpen)(stockListData.id);
      } else if (e.translationX < -SWIPE_THRESHOLD) {
        translateX.value = withTiming(-SWIPE_THRESHOLD, {
          duration: ANIMATION_DURATION,
        });
        runOnJS(onOpen)(stockListData.id);
      } else {
        translateX.value = withTiming(0, { duration: ANIMATION_DURATION });
      }
    });

  // Tap gesture to close row
  const tapGesture = Gesture.Tap().onEnd(() => {
    translateX.value = withTiming(0, { duration: ANIMATION_DURATION });
  });

  const rowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    backgroundColor:
      translateX.value !== 0 ? colors.cardSecondary : colors.card,
  }));

  const leftBtnStyle = useAnimatedStyle(() => ({
    opacity: translateX.value > SWIPE_THRESHOLD / 2 ? 1 : 0,
  }));

  const rightBtnStyle = useAnimatedStyle(() => ({
    opacity: translateX.value < -SWIPE_THRESHOLD / 2 ? 1 : 0,
  }));

  const { mutate: handleAddSecondaryStock, isLoading } = useAddSecondaryStock();
  const { mutate: handleSellSecondaryStock, isLoading: selling } =
    useSellSecondaryStock();
  const [modalBuyVisible, setBuyModalVisible] = useState(false);
  const [modalSellVisible, setSellModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const longPressGesture = Gesture.LongPress()
    .minDuration(300)
    .onStart(() => {
      console.log('working longpress');
      if (stockListData?.multi) {
        runOnJS(setMenuVisible)(true);
      }
    });

  const combinedGesture = Gesture.Race(
    longPressGesture,
    panGesture,
    tapGesture,
  );

  // Calculate dynamic table height for menu positioning
  const tableRowCount = stockListData?.multidata?.length || 0;
  const dynamicTableHeight = Math.min(tableRowCount * 40 + 40, 300);

  return (
    <View style={styles.rowContainer}>
      {/* Left action button */}
      <Animated.View
        style={[
          styles.actionBtn,
          styles.leftBtn,
          leftBtnStyle,
          { backgroundColor: colors.accent },
        ]}
      >
        <Pressable onPress={() => setSellModalVisible(true)}>
          <Text style={[styles.text, { color: colors.text }]}>Sell</Text>
        </Pressable>
        <StockModal
          visible={modalSellVisible}
          type="sell"
          stockData={stockListData}
          onClose={() => setSellModalVisible(false)}
          onSubmit={(sellPrice, sellQuantity, tax, soldStockId) =>
            handleSellSecondaryStock({
              stockId: stockListData.id,
              multiStockId: soldStockId,
              price: sellPrice,
              quantity: sellQuantity,
              capitalGain: tax,
            })
          }
          defaultName={stockListData.symbol}
          defaultQuantity={String(10)}
        />
      </Animated.View>

      {/* Right action button */}
      <Animated.View
        style={[
          styles.actionBtn,
          styles.rightBtn,
          rightBtnStyle,
          { backgroundColor: colors.negative },
        ]}
      >
        <Pressable onPress={() => setBuyModalVisible(true)}>
          <Text>RIGHT</Text>
        </Pressable>

        <StockModal
          visible={modalBuyVisible}
          onClose={() => setBuyModalVisible(false)}
          type="buy"
          onSubmit={(Name, Quantity) =>
            handleAddSecondaryStock({
              userStockId: stockListData.id,
              Price: String(stockListData.ltp),
              Quantity,
              Symbol: stockListData.symbol,
              Name,
            })
          }
          defaultName={stockListData.symbol}
          defaultQuantity={String(10)}
        />
      </Animated.View>

      {/* Swipeable row */}
      <GestureDetector gesture={combinedGesture}>
        <Animated.View
          style={[styles.listItem, rowStyle, { backgroundColor: colors.card }]}
        >
          <View style={styles.itemContainer}>
            <View style={styles.leftSection}>
              <Image
                source={{
                  uri: `${Config.COMPANY_LOGO_URL}/${stockListData?.symbol}.webp`,
                }}
                style={{ height: 30, aspectRatio: 1, borderRadius: 25 }}
                resizeMode="cover"
              />
              <View style={styles.symbolValue}>
                <Text style={[styles.symbol, { color: colors.text }]}>
                  {stockListData.symbol}
                </Text>
                <Text style={[styles.value, { color: colors.secondaryText }]}>
                  Ltp {stockListData?.ltp ?? '--'}
                </Text>
              </View>
            </View>

            <View style={{ width: 100, height: 50 }}>
              {/* <CustomMiniGraph data={stockListData?.graph ?? []} /> */}
            </View>

            {/* Right section: units + change */}
            <View style={styles.rightSection}>
              <Text style={[styles.units, { color: colors.secondaryText }]}>
                {stockListData?.quantity ?? '--'} units
              </Text>
              <View style={styles.changeContainer}>
                {stockListData?.change === 0 ||
                stockListData?.change === null ||
                stockListData?.change === undefined ? (
                  ''
                ) : stockListData?.change < 0 ? (
                  <ChevronDown size={16} color={colors.negative} />
                ) : (
                  <ChevronUp size={16} color={colors.positive} />
                )}
                <Text
                  style={[
                    styles.changeText,
                    {
                      color:
                        stockListData?.change === 0 ||
                        stockListData?.change === null ||
                        stockListData?.change === undefined
                          ? colors.secondaryText
                          : stockListData?.change < 0
                          ? colors.negative
                          : colors.positive,
                    },
                  ]}
                >
                  {stockListData?.change ?? '--'}%
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </GestureDetector>

      {/* Menu with dynamic positioning */}
      <Menu
        opened={menuVisible}
        onBackdropPress={() => setMenuVisible(false)}
        style={{
          position: 'absolute',
          top: -(dynamicTableHeight + 20), // Position above based on table height
          alignSelf: 'center',
          width: '100%',
        }}
      >
        <MenuTrigger text="" />
        <MenuOptions
          optionsContainerStyle={{
            width: SCREEN_WIDTH * 0.95,
            borderRadius: 8,
            backgroundColor: colors.secondBackground,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            padding: 8,
          }}
        >
          <StockTable stockListData={stockListData?.multidata} />
        </MenuOptions>
      </Menu>
    </View>
  );
};

const TestSwip: React.FC<StockListProps> = ({ stockList }) => {
  const [openRowId, setOpenRowId] = useState<string | null>(null);
  const rowRefs = useRef<Record<string, RowRef>>({});

  const handleOpen = (id: string) => {
    if (openRowId && openRowId !== id) {
      rowRefs.current[openRowId]?.close();
    }
    setOpenRowId(id);
  };

  const registerRowRef = (id: string, ref: RowRef) => {
    rowRefs.current[id] = ref;
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={stockList}
        scrollEnabled={false}
        keyExtractor={(item, index) =>
          item.id ? String(item.id) : `${item.symbol}-${index}`
        }
        renderItem={({ item }) => (
          <SwipeableRow
            key={item.id || `${item.symbol}`}
            isOpen={openRowId === item.id}
            onOpen={handleOpen}
            refCallback={registerRowRef}
            stockListData={item}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  rowContainer: {
    width: '100%',
    marginBottom: 1,
    justifyContent: 'center',
  },
  listItem: {
    height: 65,
    borderRadius: 12,
    justifyContent: 'center',
  },
  actionBtn: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -28 }],
    width: 80,
    height: '85%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  leftBtn: { left: 0 },
  rightBtn: { right: 0 },
  text: { fontWeight: 'bold' },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  leftSection: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  logo: { width: 30, height: 30, borderRadius: 50, padding: 5 },
  symbolValue: { flexDirection: 'column' },
  symbol: { fontWeight: 'bold', fontSize: 16 },
  value: { fontSize: 14 },
  graph: { fontSize: 14 },
  rightSection: { flexDirection: 'column', alignItems: 'center' },
  units: { fontSize: 14 },
  changeContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  changeText: { fontSize: 14, marginLeft: 4 },
  head: { height: 40, backgroundColor: '#f1f8ff' },
  tableText: { margin: 6, textAlign: 'center', fontSize: 12 },
});

export default TestSwip;
