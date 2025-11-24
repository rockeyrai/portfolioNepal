import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Button } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import DonutChart from './components/DonutChart';
import { useThemeColors } from '../../utils/ColorTheme';
import ProfileHeader from '../../components/parts/header';

const COLORS = [
  '#177AD5',
  '#79D2DE',
  '#ED6665',
  '#F4A261',
  '#2A9D8F',
  '#E9C46A',
  '#9B5DE5',
  '#F15BB5',
];

const AnalysisScreen = () => {
  const list = useSelector((state: RootState) => state.userPortfolio.byId);
  const allIds = useSelector((state: RootState) => state.userPortfolio.allIds);
  const { colors } = useThemeColors();
console.log("working",list)
const [selectedFilter, setSelectedFilter] = useState<'quantity' | 'price' | 'sectorName'>('quantity');

  
  const [activeSymbol, setActiveSymbol] = useState<string | null>(null);

  // Separate the data processing from shift calculation
  const baseData = useMemo(() => {
    if (!allIds || allIds.length === 0) {
      return { pieData: [], total: 0 };
    }

    // Build raw values with symbol
    let rawData: { symbol: string; value: number }[] = [];
    
    if (selectedFilter === 'sectorName') {
      const sectorMap: Record<string, number> = {};
      allIds.forEach(id => {
        const item = list[id];
        if (item) {
          const s = item.sectorName || 'Unknown';
          sectorMap[s] = (sectorMap[s] || 0) + item.quantity;
        }
      });
      rawData = Object.entries(sectorMap).map(([symbol, value]) => ({
        symbol,
        value,
      }));
    } else {
      rawData = allIds
        .map(id => {
          const item = list[id];
          if (!item) return null;
          return {
            symbol: item.symbol,
            value:
              selectedFilter === 'quantity'
                ? item.quantity
                : parseFloat(item.price) || 0,
          };
        })
        .filter((item): item is { symbol: string; value: number } => item !== null);
    }

    // Total sum
    const totalValue = rawData.reduce((acc, curr) => acc + curr.value, 0) || 1;

    // Map to PieData with percentage
    const data = rawData.map((d, i) => {
      const percent = Math.round((d.value / totalValue) * 100);
      return {
        value: d.value,
        color: COLORS[i % COLORS.length],
        symbol: d.symbol,
        percent: percent,
        shiftX: 0,
        shiftY: 0
      };
    });

    return { pieData: data, total: totalValue };
  }, [allIds, list, selectedFilter]);

  // Apply shift based on activeSymbol
  const processedData = useMemo(() => {
    if (!baseData.pieData || baseData.pieData.length === 0) {
      return baseData.pieData;
    }

    if (activeSymbol === null) {
      return baseData.pieData;
    }

    const activeIndex = baseData.pieData.findIndex(item => item.symbol === activeSymbol);
    
    if (activeIndex === -1) {
      return baseData.pieData;
    }

    // Calculate previous slices sum
    let sumPrev = 0;
    for (let i = 0; i < activeIndex; i++) {
      sumPrev += (baseData.pieData[i].percent / 100) * 360;
    }

    const sliceAngle = (baseData.pieData[activeIndex].percent / 100) * 360;
const centerAngle = sumPrev + sliceAngle / 2 - 90; // subtract 90° to rotate top
const rad = (centerAngle * Math.PI) / 180;
const distance = 12;

return baseData.pieData.map((item, idx) => {
  if (idx === activeIndex) {
    return {
      ...item,
      shiftX: Math.cos(rad) * distance,
      shiftY: Math.sin(rad) * distance,
    };
  }
  return { ...item, shiftX: 0, shiftY: 0 };
});

  }, [baseData.pieData, activeSymbol]);

  return (
    <>
      <ProfileHeader />
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 70,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: colors.background }}
      >
        <View style={{ flexDirection: 'row', marginVertical: 10, gap: 10 }}>
          <Button title="Unit" onPress={() => setSelectedFilter('quantity')} />
          <Button title="Price" onPress={() => setSelectedFilter('price')} />
          <Button
            title="Sector"
            onPress={() => setSelectedFilter('sectorName')}
          />
        </View>

        <View style={{ marginTop: 20 }}>
          {processedData && processedData.length > 0 && (
            <DonutChart 
              data={processedData} 
              totalValue={baseData.total} 
              currentFilter={selectedFilter}
              activeSymbol={activeSymbol}
              onSymbolPress={setActiveSymbol}
            />
          )}
        </View>

        <Text style={{ color: colors.text, marginTop: 20 }}>
          Analysis text
        </Text>
      </ScrollView>
    </>
  );
};

export default AnalysisScreen;