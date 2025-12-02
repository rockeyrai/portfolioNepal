import React from 'react';
import { Dimensions, Text, View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { useThemeColors } from '../../../utils/ColorTheme';
import graphQuerry from '../../../services/graph';
import { RootState } from '../../../redux/store';
import { useSelector } from 'react-redux';
const MainChart = () => {
  const { colors } = useThemeColors();

  const normalize = (data: any[]) => {
    if (!data || data.length === 0) return [];

    const values = data.map(d => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);

    if (max - min === 0) {
      return data.map(() => ({ value: 0.5 })); // avoid divide-by-zero
    }

    return data.map(d => ({
      value: (d.value - min) / (max - min), // normalize 0–1
    }));
  };


  const scaleTo100 = (data: any[]) => {
  if (!data || data.length === 0) return [];

  const values = data.map(d => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);

  return data.map(d => ({
    value: ((d.value - min) / (max - min)) * 100,
  }));
};


  const normalizeApiPoints = (raw: any[]) => {
    if (!raw || raw.length === 0) return [];

    return raw.map(item => ({
      // date: item.t * 1000,
      value: Number(item?.c),
    }));
  };
  const selectedSector = useSelector(
    (state: RootState) => state.portfolioSector.Sector,
  );

  const { data: nepseGraphData } = graphQuerry.getNepseDayGraph();
  const { data: sectorGraphData } = graphQuerry.getSectorGraphData(
    selectedSector,
    '86400',
  );

  const { width: mobileWidth } = Dimensions.get('window');
  const NepseData = scaleTo100(normalizeApiPoints(nepseGraphData));
  const SectorData = scaleTo100(normalizeApiPoints(sectorGraphData));

  console.log('nepse data', NepseData);
  console.log('sector data', SectorData);

  if (!NepseData || NepseData.length < 2) {
    return <Text style={{ color: colors.text }}>Loading chart...</Text>;
  }
  return (
    <View>
      <View
        style={{
          backgroundColor: colors.background,
          height: 110,
          width: '80%',
          borderBottomColor: colors.secondBackground,
          borderBottomWidth: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 'auto',
          marginHorizontal: 'auto',
        }}
      >
        <LineChart
          animationDuration={5000}
          onDataChangeAnimationDuration={5000}
          isAnimated
          data={NepseData}
          data2={SectorData}
          height={100}
          width={mobileWidth * 0.7}
          thickness={2}
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
          // yAxisOffset={2665}
          // maxValue={2672}
          verticalLinesUptoDataPoint
          animateTogether
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
        {selectedSector !== "Portfolio" &&(
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
          <Text style={{ color: colors.text, fontSize: 12 }}>{selectedSector}</Text>
        </View>
        )}
  
      </View>
    </View>
  );
};

export default MainChart;
