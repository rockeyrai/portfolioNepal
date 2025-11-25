import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GraphPage } from '../../../components/parts/mainGraph';
import marketQuerry from '../../../services/market';
import graphQuerry from '../../../services/graph';
import SortUpSvg from '../../../assets/svg/sortup';
import SortDownSvg from '../../../assets/svg/sortdown';
import { useThemeColors } from '../../../utils/ColorTheme';
import { LineChart } from 'react-native-gifted-charts';

const MainNepseGraph = () => {
  const { data: NepseSummaryData = [] } = marketQuerry.getNepseSummary();
  const { data: nepseGraphData } = graphQuerry.getNepseDayGraph();
  const { colors } = useThemeColors();
  const lineData = [
    { value: 50, dataPointText: '50' },
    { value: 40, dataPointText: '10' },
    { value: 30, dataPointText: '30' },
    { value: 58, dataPointText: '58' },
    { value: 56, dataPointText: '56' },
    { value: 78, dataPointText: '78' },
    { value: 74, dataPointText: '74' },
    { value: 98, dataPointText: '98' },
  ];

  const lineData2 = [
    { value: 0, dataPointText: '0' },
    { value: 20, dataPointText: '20' },
    { value: 18, dataPointText: '18' },
    { value: 40, dataPointText: '40' },
    { value: 36, dataPointText: '36' },
    { value: 60, dataPointText: '60' },
    { value: 54, dataPointText: '54' },
    { value: 85, dataPointText: '85' },
  ];
  console.log('graph data', nepseGraphData);

  function generateFakeData(count: number): [] {
  const data = [];
  let lastClose = 2600; // starting point

  for (let i = 0; i < count; i++) {
    const open = lastClose + (Math.random() - 0.5) * 10;
    const high = open + Math.random() * 10;
    const low = open - Math.random() * 10;
    const close = low + Math.random() * (high - low);

    data.push({
      id: 243 + i,                // unique id
      t: (1763889300 + i * 60).toString(), // timestamp increments by 60
      o: parseFloat(open.toFixed(2)),
      h: parseFloat(high.toFixed(2)),
      l: parseFloat(low.toFixed(2)),
      c: parseFloat(close.toFixed(2)),
      type: 1,
      v: Math.floor(Math.random() * 10),   // random integer
    });

    lastClose = close; // next iteration uses last close
  }

  return data;
}


  return (
    <View
      style={{
        paddingTop: 10,
        // borderColor: 'black',
        borderRadius: 10,
        elevation: 2,
        marginHorizontal: 20,
        backgroundColor: colors.secondBackground,
      }}
    >
      <View
        style={{
          paddingHorizontal: 10,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}
      >
        <View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: 700, color: colors.text }}>
              {' '}
              NEPSE
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontWeight: 400,
                color: colors.secondaryText,
              }}
            >{`(${NepseSummaryData?.schange})`}</Text>
          </View>
          <View
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
            }}
          >
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <Text
                style={{ fontSize: 14, fontWeight: 700, color: colors.text }}
              >
                {NepseSummaryData?.currentValue}
              </Text>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                {NepseSummaryData?.perChange ? (
                  <SortUpSvg width={15} height={15} color="green" />
                ) : (
                  <SortDownSvg width={15} height={15} color="red" />
                )}

                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color:
                      NepseSummaryData?.percentage === 0 &&
                      NepseSummaryData?.percentage === null &&
                      NepseSummaryData?.percentage === undefined
                        ? colors.secondaryText
                        : NepseSummaryData?.percentage < 0
                        ? colors.negative
                        : colors.positive,
                  }}
                >
                  {NepseSummaryData?.perChange}%
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'baseline',
            gap: 8,
          }}
        >
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={[styles.rangeTitle, { color: colors.text }]}>
              Hig:{' '}
            </Text>
            <Text style={[styles.rangeValue, { color: colors.text }]}>
              5434
            </Text>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={[styles.rangeTitle, { color: colors.text }]}>
              Low:{' '}
            </Text>
            <Text style={[styles.rangeValue, { color: colors.text }]}>
              4321
            </Text>
          </View>
        </View>
      </View>
      <GraphPage points={generateFakeData(50)} />
      {/* <View>
        <LineChart
          animationDuration={5000}
          onDataChangeAnimationDuration={2000}
          isAnimated
          data={lineData}
          // data2={lineData2}
          height={150}
          width={200}
          thickness={3}
          adjustToWidth
          curved
          curveType={1}
          curvature={0.9}
          hideRules
          hideDataPoints1
          hideAxesAndRules
          color1="skyblue"
          animateOnDataChange
          onDataChangeAnimationDuration={300}
          textFontSize={13}
        />
      </View> */}
    </View>
  );
};

export default MainNepseGraph;

const styles = StyleSheet.create({
  rangeTitle: {
    fontSize: 10,
  },
  rangeValue: {
    fontSize: 12,
  },
});
