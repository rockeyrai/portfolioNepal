import React from 'react';
import { Image, Text, View } from 'react-native';
import Config from 'react-native-config';
import { useThemeColors } from '../../utils/ColorTheme';
import MinGraph from './MinGraph';

const StockListCard = item => {
  const { colors } = useThemeColors();

  return (
    <View
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        backgroundColor: colors.card,
        borderRadius: 10,
        paddingVertical: 0,
        paddingHorizontal: 6,
        gap:6,
        // marginBottom: 4,
        height: 70,
      }}
    >
      {/* right section  */}
      <View
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          width: '30%',
        //   paddingLeft: 6,
        }}
      >
        <Image
          style={{ height: 30, width: 30, borderRadius: 25 }}
          key={item?.symbol}
          source={{ uri: `${Config.COMPANY_LOGO_URL}/${item?.symbol}.webp` }}
          defaultSource={{
            uri: 'https://portfolionepal.com/logos/pn-nobg.png',
          }}
          resizeMode="contain"
        />
        <View
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '4',
          }}
        >
          <Text style={{ color: colors.text, fontSize: 18, fontWeight: 600 }}>
            {item?.symbol}
          </Text>
          <Text style={{ color: colors.secondaryText, fontSize: 12 }}>
            {item?.quantity} units
          </Text>
        </View>
      </View>
      {/* middle Grapph  */}
      <View
        style={{
          width: '30%',
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'flex-end',
        //   backgroundColor:colors.text
        }}
      >
        <MinGraph latestData={item.graph} />
      </View>
      <View
        style={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '4',
          width: '30%',
        }}
      >
        <Text style={{ color: colors.text, fontSize: 14, fontWeight: 600 }}>
          Rs {item?.ltp}
        </Text>
        <Text
          style={{
            color:
              item?.sChange === 0 &&
              item?.sChange === null &&
              item?.sChange === undefined
                ? colors.secondaryText
                : item?.sChange < 0
                ? colors.negative
                : colors.positive,
          }}
        >
          {item?.sChange}%
        </Text>
      </View>
    </View>
  );
};

export default StockListCard;
