import { Dimensions, Text, View, TouchableWithoutFeedback } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { useThemeColors } from '../../../utils/ColorTheme';
import React from 'react';

const DonutChart = ({
  data,
  totalValue,
  currentFilter,
  activeSymbol,
  onSymbolPress,
}) => {
  const mobileWidth = Dimensions.get('window').width;
  const { colors } = useThemeColors();

  console.log('chart data', JSON.stringify(data));
  return (
    <TouchableWithoutFeedback onPress={() => onSymbolPress(null)}>
      <View
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <View style={{ alignItems: 'center' }}>
          <PieChart
            data={data}
            donut
            isAnimated
            showGradient
            onPress={(item, index) => {
              // Handle different return formats from onPress
              const symbol = item?.symbol || data[index]?.symbol;

              if (activeSymbol === symbol) {
                onSymbolPress(null); // deselect
              } else {
                onSymbolPress(symbol); // select
              }
            }}
            sectionAutoFocus
            // focusOnPress
            strokeWidth={5}
            strokeColor={colors.secondBackground}
            textSize={12}
            showValuesAsLabels
            textColor={colors.secondBackground}
            radius={(mobileWidth * 120) / 320}
            innerRadius={(mobileWidth * 80) / 320}
            innerCircleColor={colors.background}
            centerLabelComponent={() => {
              const activeItem = data?.find(item => item.active);

              return (
                <View
                  style={{ justifyContent: 'center', alignItems: 'center' }}
                >
                  <Text
                    style={{ fontSize: 22, color: 'white', fontWeight: 'bold' }}
                  >
                    {activeItem ? activeItem.value : totalValue}{' '}
                  </Text>
                  <Text style={{ fontSize: 14, color: 'white', gap: 4 }}>
                    {data?.find(item => item.active)?.symbol ?? 'Total'}{' '}
                    {currentFilter}
                  </Text>
                </View>
              );
            }}
          />
        </View>

        {/* legend */}
        <View
          style={{
            marginTop: 0,
            flexDirection: 'row',
            gap: 6,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {data?.map((item, index) => (
            <View
              key={index}
              style={{ flexDirection: 'row', alignItems: 'center' }}
            >
              <View
                style={{
                  height: 10,
                  width: 10,
                  backgroundColor: item.color,
                  borderRadius: 2,
                  marginRight: 10,
                }}
              />

              <Text style={{ color: colors.text, fontSize: 12, opacity: 0.8 }}>
                {item.symbol}{' '}
              </Text>
              <Text
                style={{ color: colors.text, fontSize: 14, fontWeight: '700' }}
              >
                {item.percent}%
              </Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default DonutChart;
