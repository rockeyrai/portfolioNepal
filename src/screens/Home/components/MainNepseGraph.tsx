import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GraphPage } from '../../../components/parts/mainGraph';
import marketQuerry from '../../../services/market';
import graphQuerry from '../../../services/graph';
import SortUpSvg from '../../../assets/svg/sortup';
import SortDownSvg from '../../../assets/svg/sortdown';
import { useThemeColors } from '../../../utils/ColorTheme';

const MainNepseGraph = () => {
  const { data: NepseSummaryData = [] } = marketQuerry.getNepseSummary();
  const { data: nepseGraphData } = graphQuerry.getNepseDayGraph();
  const { colors } = useThemeColors();

  return (
    <View
      style={{
        paddingTop: 10,
        // borderColor: 'black',
        borderRadius: 10,
        elevation: 2,
        marginHorizontal: 20,
        backgroundColor: colors.background,
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
            <Text style={{ fontSize: 18, fontWeight: 700 }}> NEPSE</Text>
            <Text
              style={{ fontSize: 12, fontWeight: 400 }}
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
              <Text style={{ fontSize: 14, fontWeight: 700 }}>
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
            <Text style={styles.rangeTitle}>Hig: </Text>
            <Text style={styles.rangeValue}>5434</Text>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={styles.rangeTitle}>Low: </Text>
            <Text style={styles.rangeValue}>4234</Text>
          </View>
        </View>
      </View>
      <GraphPage points={nepseGraphData} />
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
