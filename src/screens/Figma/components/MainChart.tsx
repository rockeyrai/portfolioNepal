import React from 'react';
import { Dimensions, Text, View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { useThemeColors } from '../../../utils/ColorTheme';

const MainChart = () => {
  const { colors } = useThemeColors();
  const lineData = [
    { value: 140 },
    { value: 40 },
    { value: 30 },
    { value: 58 },
    { value: 56 },
    { value: 78 },
    { value: 74 },
    { value: 98 },
    { value: 85 },
        { value: 40 },
    { value: 36 },
    { value: 60 },
    { value: 54 },
  ];
  const lineData2 = [
    { value: 100 },
    { value: 20 },
    { value: 18 },
    { value: 40 },
    { value: 36 },
    { value: 60 },
    { value: 54 },
    { value: 85 },
    { value: 98 },
    { value: 56 },
    { value: 140 },
    { value: 40 },
    { value: 30 },
  ];

  const { width: mobileWidth } = Dimensions.get('window');

  return (
    <View>
      <View
        style={{
          backgroundColor: colors.background,
          height: 110,
          width: mobileWidth,
          borderBottomColor: colors.secondBackground,
          borderBottomWidth: 2,
          display:'flex',
          justifyContent:"center",
          alignItems:'center',
          paddingHorizontal:'auto'

        }}
      >
        <LineChart
          animationDuration={5000}
          onDataChangeAnimationDuration={2000}
          isAnimated
          data={lineData}
          data2={lineData2}
          height={100}
          width={mobileWidth *0.8}
          thickness={1}
          // endSpacing={23}
          // showVerticalLines
          adjustToWidth
          backgroundColor={colors.background}
          curved
          curveType={1}
          curvature={0.9}
          hideRules
          trimYAxisAtTop
          hideDataPoints1
          hideDataPoints2
          hideAxesAndRules
          hideYAxisText
          color1="red"
          initialSpacing={0}
          color2="green"
          animateOnDataChange
          textFontSize={13}
          xAxisTextNumberOfLines={0}
          yAxisTextNumberOfLines={0}
        />
      </View>
      <View
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          flexDirection: 'row',
          gap: 16,
          backgroundColor: colors.background,
        }}
      >
        <View
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            // width: '100%',
            gap: 4,
          }}
        >
          <View
            style={{
              backgroundColor: 'red',
              height: 8,
              aspectRatio: 1,
              borderRadius: 2,
            }}
          />
          <Text style={{ color: colors.text, fontSize: 12 }}>NEPSE</Text>
        </View>
        <View
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            // width: '100%',
            gap: 4,
          }}
        >
          <View
            style={{
              backgroundColor: 'green',
              height: 8,
              aspectRatio: 1,
              borderRadius: 2,
            }}
          />
          <Text style={{ color: colors.text, fontSize: 12 }}>Hydro</Text>
        </View>
      </View>
    </View>
  );
};

export default MainChart;
