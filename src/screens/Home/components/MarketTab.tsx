import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Image,
} from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import marketQuerry from '../../../services/market';
import Config from 'react-native-config';
import { useThemeColors } from '../../../utils/ColorTheme';
import { Plus } from 'lucide-react-native';

// ---------------------------
// MEMOIZED LIST ITEM
// ---------------------------
const ListItem = React.memo(({ item }: any) => {
  const { colors } = useThemeColors();

  const [imgError, setImgError] = useState(false);

  return (
    <View style={[styles.listItem, { backgroundColor: colors.background }]}>
      <View style={styles.leftRow}>
        <View style={styles.logoWrapper}>
          <Image
            source={
              imgError
                ? require('../../../assets/logo/portfolio.png')
                : { uri: `${Config.COMPANY_LOGO_URL}/${item?.symbol}.webp` }
            }
            onError={() => setImgError(true)}
            style={styles.logoImage}
            resizeMode="cover"
          />
        </View>

        <View>
          <Text style={[styles.symbol, { color: colors.text }]}>
            {item.symbol}
          </Text>
          <Text style={[styles.value, { color: colors.text }]}>
            {item.totalTradeQuantity}
          </Text>
        </View>
      </View>

      <View style={styles.rightRow}>
        <View style={{ flexDirection: 'row',justifyContent:"center",alignItems:'center' }}>
          <Plus
            size={10}
            color={
              item?.percentageChange === 0 &&
              item?.percentageChange === null &&
              item?.percentageChange === undefined
                ? colors.secondaryText
                : item?.percentageChange < 0
                ? colors.negative
                : colors.positive
            }
          />
          <Text
            style={[
              styles.value,
              {
                color:
                  item?.percentageChange === 0 &&
                  item?.percentageChange === null &&
                  item?.percentageChange === undefined
                    ? colors.secondaryText
                    : item?.percentageChange < 0
                    ? colors.negative
                    : colors.positive,
              },
            ]}
          >
            {item.percentageChange}%
          </Text>
        </View>

        <Text style={[styles.value, { color: colors.text }]}>
          {item.lastTradedPrice}
        </Text>
      </View>
    </View>
  );
});

// ---------------------------
// SEPARATE PURE COMPONENT FOR LIST
// ---------------------------
const MarketList = React.memo(({ data, loading }: any) => {
  const { colors } = useThemeColors();

  if (loading) {
    return (
      <View style={styles.loaderCenter}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!data?.length) {
    return <Text style={[styles.noData, { color: colors.text }]}>No data</Text>;
  }

  return (
    <View style={styles.scene}>
      {data.map((item: any, index: number) => (
        <ListItem key={index} item={item} />
      ))}
    </View>
  );
});

// ---------------------------
// MAIN COMPONENT
// ---------------------------
const MarketTab = () => {
  const layout = Dimensions.get('window');

  // SAFE: All React Query hooks at top-level
  const { data: gainerData, isLoading: gainerLoading } =
    marketQuerry.getFilterLiveData({ filter: 'gainer', pageSize: 5 });

  const { data: loserData, isLoading: loserLoading } =
    marketQuerry.getFilterLiveData({ filter: 'loser', pageSize: 5 });

  const { data: turnoverData, isLoading: turnoverLoading } =
    marketQuerry.getFilterLiveData({ filter: 'turnover', pageSize: 5 });

  const { data: volumeData, isLoading: volumeLoading } =
    marketQuerry.getFilterLiveData({ filter: 'volume', pageSize: 5 });

  const [index, setIndex] = useState(0);

  const routes = [
    { key: 'gainer', title: 'Gainer' },
    { key: 'loser', title: 'Loser' },
    { key: 'turnover', title: 'Turnover' },
    { key: 'volume', title: 'Volume' },
  ];

  const CustomTabBar = ({ navigationState, position, jumpTo }: any) => {
    return (
      <View style={styles.customTabBar}>
        {navigationState.routes.map((route: any, i: number) => {
          const active = navigationState.index === i;

          return (
            <Text
              key={route.key}
              onPress={() => jumpTo(route.key)}
              style={[
                styles.customTabItem,
                active && styles.customTabItemActive,
                {
                  color: colors.text,
                  backgroundColor: active && colors.tabActive,
                },
              ]}
            >
              {route.title}
            </Text>
          );
        })}
      </View>
    );
  };

  // NO HOOKS HERE → SAFE
  const renderScene = ({ route }: any) => {
    switch (route.key) {
      case 'gainer':
        return <MarketList data={gainerData} loading={gainerLoading} />;

      case 'loser':
        return <MarketList data={loserData} loading={loserLoading} />;

      case 'turnover':
        return <MarketList data={turnoverData} loading={turnoverLoading} />;

      case 'volume':
        return <MarketList data={volumeData} loading={volumeLoading} />;

      default:
        return null;
    }
  };
  const { colors } = useThemeColors();

  return (
    <View style={{ flex: 1, height: 350, backgroundColor: colors.background }}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={props => <CustomTabBar {...props} />}
      />
    </View>
  );
};

export default MarketTab;

// ---------------------------
// STYLES
// ---------------------------
const styles = StyleSheet.create({
  tabBar: {
    height: 40,
  },
  label: {
    fontWeight: '600',
    fontSize: 8,
    textTransform: 'capitalize',
  },
  tabStyle: {
    paddingVertical: 2,
  },
  indicator: {
    height: 4,
  },

  scene: {
    flex: 1,
    padding: 15,
  },

  listItem: {
    paddingVertical: 8,
    // borderBottomWidth: 0.4,
    // borderColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  customTabBar: {
    flexDirection: 'row',
    height: 30,
    alignItems: 'center',
    justifyContent: 'space-around',
  },

  customTabItem: {
    fontSize: 12,
    fontWeight: '600',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 10,
  },

  customTabItemActive: {
    fontWeight: '700',
    fontSize: 14,
    // borderBottomWidth: 3,
    // borderBottomColor: 'gold',
    // paddingBottom: 4,
  },

  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rightRow: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
  },

  logoWrapper: {
    width: 30,
    height: 30,
    backgroundColor:'red',
        borderRadius: 25,padding:1,             
        overflow:"hidden"

  },
  logoImage: {
    width: '100%',
    height: '100%',
  },

  symbol: {
    fontWeight: '700',
    fontSize: 14,
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
  },

  noData: {
    textAlign: 'center',
    marginTop: 20,
  },

  loaderCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
