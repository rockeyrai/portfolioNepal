import { ChevronDown, ChevronUp } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
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
import { useAddSecondaryStock } from '../../services/portfolio';
// import { CustomMiniGraph } from "../MinGraph";
// import HeatmapRow from "./HeatMap";
// import { CompanyLogo } from "../ui/customImage";

const SWIPE_THRESHOLD = 90;
const ANIMATION_DURATION = 200;

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
    .activeOffsetX([-2, 2]) // start only after horizontal movement
    .failOffsetY([-60, 60]) // vertical movement cancels horizontal swipe
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

  const combinedGesture = Gesture.Race(panGesture, tapGesture);

  const rowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    backgroundColor:
      translateX.value !== 0 ? colors.cardSecondary : colors.card, // use theme color when not swiped
  }));

  const leftBtnStyle = useAnimatedStyle(() => ({
    opacity: translateX.value > SWIPE_THRESHOLD / 2 ? 1 : 0,
  }));
  const rightBtnStyle = useAnimatedStyle(() => ({
    opacity: translateX.value < -SWIPE_THRESHOLD / 2 ? 1 : 0,
  }));

  console.log(Config.COMPANY_LOGO_URL);
  const { mutate: handleAddSecondaryStock, isLoading } = useAddSecondaryStock();

    const buttonTapGesture = Gesture.Tap()
    .onStart(() => {
      console.log('Button pressed', stockListData.symbol);
      runOnJS(handleAddSecondaryStock)({
        userStockId: stockListData.id,
        Price: String(stockListData.ltp),
        Quantity: String(stockListData.quantity),
        Symbol: stockListData.symbol,
        Name: stockListData.symbol,
      });
    });

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
        <Pressable
          onPress={() => console.log('Left pressed', stockListData.symbol)}
        >
          <Text style={[styles.text, { color: colors.text }]}>Sell</Text>
        </Pressable>
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
        <GestureDetector gesture={buttonTapGesture}>
          <Animated.View>
            <Text style={[styles.text, { color: colors.text }]}>RIGHT</Text>
          </Animated.View>
        </GestureDetector>
      </Animated.View>

      {/* Swipeable row */}
      <GestureDetector gesture={combinedGesture}>
        <Animated.View
          style={[styles.listItem, rowStyle, { backgroundColor: colors.card }]}
        >
          <View style={styles.itemContainer}>
            {/* Left section: logo + symbol/value */}
            <View style={styles.leftSection}>
              {/* <CompanyLogo symbol={stockListData?.symbol} /> */}
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
                {/* <HeatmapRow data={stockListData?.heatmap} /> */}
              </View>
            </View>

            {/* Center section: graph placeholder */}
            {/* <Text style={[styles.graph, { color: colors.muted }]}>
              Graph
            </Text> */}
            <View style={{ width: 100, height: 50 }}>
              {/* <CustomMiniGraph data={stockListData?.graph ?? []} /> */}
            </View>
            {/* Right section: units + change */}
            <View style={styles.rightSection}>
              <Text style={[styles.units, { color: colors.secondaryText }]}>
                {stockListData?.quantity ?? '--'} units
              </Text>
              <View style={styles.changeContainer}>
                {stockListData?.change === 0 &&
                stockListData?.change === null &&
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
                        stockListData?.change === 0 &&
                        stockListData?.change === null &&
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
    // display:"flex",
    // alignItems:"center",
    // flexDirection:"row",
    // backgroundColor: 'red',
  },
  listItem: {
    height: 65,
    borderRadius: 12,
    justifyContent: 'center',
    // paddingHorizontal: 5,
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
});

export default TestSwip;
