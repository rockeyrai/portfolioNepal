import React, { useState, useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import TestSwip from '../../../components/ui/swipCard';
import { useThemeColors } from '../../../utils/ColorTheme';
import { ArrowUp } from 'lucide-react-native';

const StockList = () => {
  const list = useSelector((state: RootState) => state.userPortfolio.byId);
  const allIds = useSelector((state: RootState) => state.userPortfolio.allIds);
  const selectedSector = useSelector(
    (state: RootState) => state.portfolioSector.Sector,
  );
  const { colors } = useThemeColors();

  const [sortMode, setSortMode] = useState<'best' | 'worst'>('best');

  // -----------------------------------------------------
  // 1️⃣ Prepare formatted list
  // -----------------------------------------------------

  // console.log("list data",list)
  const formattedData = useMemo(() => {
    return allIds.map(id => {
      const item = list[id];
      return {
        id: String(item?.id),
        symbol: item?.symbol,
        ltp: String(item?.lastTradedPrice),
        quantity: item?.quantity,
        change: Number(item?.perChange), // use number for sorting
        sector: item?.sectorName,
        transactionId:item?.transactionId,
        multi:item?.has_multiple_transactions,
        multidata:item?.user_transactions,
      };
    });
  }, [allIds, list]);
  

  // -----------------------------------------------------
  // 2️⃣ Apply Sector Filter
  // -----------------------------------------------------
  const sectorFiltered = useMemo(() => {
    if (selectedSector === 'Portfolio') {
      return formattedData;
    }
    return formattedData.filter(item => item.sector === selectedSector);
  }, [formattedData, selectedSector]);

  // -----------------------------------------------------
  // 3️⃣ Sort (Best or Worst)
  // -----------------------------------------------------
  const sortedData = useMemo(() => {
    const data = [...sectorFiltered];

    if (sortMode === 'best') {
      data.sort((a, b) => b.change - a.change); // highest first
    } else {
      data.sort((a, b) => a.change - b.change); // lowest first
    }

    return data.slice(0, 5); // max 5 items
  }, [sectorFiltered, sortMode]);

  return (
    <View style={{paddingHorizontal:10}}>
      {/* ------------------------------------------- */}
      {/* Toggle Button: Best ↔ Worst */}
      {/* ------------------------------------------- */}
      <View style={{display:"flex", justifyContent:'space-between', alignItems:'center', flexDirection:"row" ,paddingHorizontal:16,paddingVertical:10
      }}>
        <View style={{display:"flex", justifyContent:'space-between', alignItems:'center',gap:4,flexDirection:'row'}}>
          <TouchableOpacity
            onPress={() => setSortMode(sortMode === 'best' ? 'worst' : 'best')}
          >
            <Text
              style={{
                color: sortMode === 'best' ? colors.positive : colors.negative,
                fontSize: 16,
                fontWeight: 'bold',
              }}
            >
              {sortMode === 'best' ? 'Best performer' : 'Worst performer'}
            </Text>
          </TouchableOpacity>
          <ArrowUp
            size={15}
            color={sortMode === 'best' ? colors.positive : colors.negative}
          />
        </View>
        <TouchableOpacity
        // onPress={() => setSortMode(sortMode === 'best' ? 'worst' : 'best')}
        >
          <Text
            style={{
              color: colors.text,
              fontSize: 16,
              fontWeight: 'bold',
            }}
          >
            See all 
          </Text>
        </TouchableOpacity>
      </View>

      {/* ------------------------------------------- */}
      {/* Pass only the final list to your card UI */}
      {/* ------------------------------------------- */}
      <TestSwip stockList={sortedData} />
    </View>
  );
};

export default StockList;



              