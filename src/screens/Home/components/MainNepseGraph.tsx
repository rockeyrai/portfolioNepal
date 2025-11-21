import React from 'react';
import { Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { GraphPage } from '../../../components/parts/mainGraph';
import marketQuerry from '../../../services/market';

const MainNepseGraph = () => {
  const fakeGraphData = Array.from({ length: 30 }).map((_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000),
    value: +(100 + Math.sin(i / 3) * 15 + Math.random() * 8).toFixed(2),
  }));

  const { data: NepseSummaryData = [] } = marketQuerry.getNepseSummary();

  console.log('nepse data', NepseSummaryData);
  return (
      <View style={{padding:10,borderColor:"black",borderRadius:10,elevation:2,margin:10}}>
        <View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Text> NEPSE</Text>
            <Text>{NepseSummaryData?.schange}</Text>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Text>{NepseSummaryData?.currentValue}</Text>
            <Text>{NepseSummaryData?.perChange}%</Text>
          </View>
        </View>
        <GraphPage points={fakeGraphData} />

      </View>
  );
};

export default MainNepseGraph;
