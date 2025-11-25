import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import DonutChart from './components/DonutChart';
import { useThemeColors } from '../../utils/ColorTheme';
import ProfileHeader from '../../components/parts/header';
import { Dropdown } from 'react-native-element-dropdown';

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

const filterOptions = [
  { label: 'Unit', value: 'Unit' },
  { label: 'Price', value: 'Price' },
  { label: 'Sector', value: 'Sector' },
];

const AnalysisScreen = () => {
  const list = useSelector((state: RootState) => state.userPortfolio.byId);
  const allIds = useSelector((state: RootState) => state.userPortfolio.allIds);
  const { colors } = useThemeColors();

  console.log("list data",list)
  const [selectedFilter, setSelectedFilter] = useState<
    'Unit' | 'Price' | 'Sector'
  >('Unit');
  const [activeSymbol, setActiveSymbol] = useState<string | null>(null);

  const baseData = useMemo(() => {
    if (!allIds || allIds.length === 0) return { pieData: [], total: 0 };

    let rawData: { symbol: string; value: number }[] = [];

    if (selectedFilter === 'Sector') {
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
        .filter(
          (item): item is { symbol: string; value: number } => item !== null,
        );
    }

    const totalValue = rawData.reduce((acc, curr) => acc + curr.value, 0) || 1;

    return {
      pieData: rawData.map((d, i) => ({
        value: d.value,
        color: COLORS[i % COLORS.length],
        symbol: d.symbol,
        percent: Math.round((d.value / totalValue) * 100),
        shiftX: 0,
        shiftY: 0,
      })),
      total: totalValue,
    };
  }, [allIds, list, selectedFilter]);

  // const processedData = useMemo(() => {
  //   if (!baseData.pieData || baseData.pieData.length === 0)
  //     return baseData.pieData;
  //   if (activeSymbol === null) return baseData.pieData;

  //   const activeIndex = baseData.pieData.findIndex(
  //     item => item.symbol === activeSymbol,
  //   );
  //   if (activeIndex === -1) return baseData.pieData;

  //   let sumPrev = 0;
  //   for (let i = 0; i < activeIndex; i++) {
  //     sumPrev += (baseData.pieData[i].percent / 100) * 360;
  //   }

  //   const sliceAngle = (baseData.pieData[activeIndex].percent / 100) * 360;
  //   const centerAngle = sumPrev + sliceAngle / 2 - 90;
  //   const rad = (centerAngle * Math.PI) / 180;
  //   const distance = 20;

  //   return baseData.pieData.map((item, idx) => {
  //     if (idx === activeIndex) {
  //       return {
  //         ...item,
  //         shiftX: Math.cos(rad) * distance,
  //         shiftY: Math.sin(rad) * distance,
  //       };
  //     }
  //     return { ...item, shiftX: 0, shiftY: 0 };
  //   });
  // }, [baseData.pieData, activeSymbol]);
  const processedData = useMemo(() => {
    if (!baseData.pieData || baseData.pieData.length === 0)
      return baseData.pieData;
    if (activeSymbol === null) return baseData.pieData;

    return baseData.pieData.map(item => {
      if (item.symbol === activeSymbol) {
        return {
          ...item,
          color: colors.background, // light green
          active: true,
        };
      }
      return item;
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
        }}
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: colors.background }}
      >
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
        <View
          style={{
            width: '100%',
            marginVertical: 10,
            paddingHorizontal: 16,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          <Dropdown
            data={filterOptions}
            labelField="label"
            valueField="value"
            value={selectedFilter}
            onChange={item => setSelectedFilter(item.value)}
            placeholder="Select Filter"
            style={{
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: 8,
              paddingHorizontal: 10,
              paddingVertical: 8,
              width: '30%',
            }}
            containerStyle={{ backgroundColor: colors.card }}
            selectedTextStyle={{ color: colors.text }}
            placeholderStyle={{ color: colors.text }}
            renderItem={item => {
              console.log('itsem', item);
              return (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 4,
                  }}
                >
                  {/* Example: You can add an icon or colored dot */}
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: colors.secondBackground,
                      marginRight: 10,
                    }}
                  />
                  <Text
                    style={{
                      color: colors.text,
                      fontWeight: 'bold',
                    }}
                  >
                    {item?.label}
                  </Text>
                </View>
              );
            }}
          />
        </View>

        <Text style={{ color: colors.text, marginTop: 20 }}>Analysis text</Text>
      </ScrollView>
    </>
  );
};

export default AnalysisScreen;
