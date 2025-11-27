import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import CustomeDropdown from '../../../components/ui/CustomeDropdown';
import { useThemeColors } from '../../../utils/ColorTheme';
import { ArrowUpIcon } from 'lucide-react-native';
import { FlashList } from '@shopify/flash-list';
import StockListCard from '../../../components/ui/StockListCard';

const PortfolioList = () => {
  const filterOptions = [
    // { label: 'Portfolio', value: 'Portfolio' },
    { label: 'Hydropower', value: 'Hydropower' },
    { label: 'MicroFinace', value: 'MicroFinace' },
  ];
  const [selectedFilter, setSelectedFilter] = useState<
    'Portfolio' | 'Hydropower' | 'MicroFinace'
  >('Portfolio');
  const { colors } = useThemeColors();
  const [toggleFilter, setToggleFilter] = useState('Best');
  const mockStockList = [
    {
      symbol: 'NABIL',
      quantity: 120,
      ltp: 820.5,
      sChange: -1.25,
      graph: [
        { value: 32 },
        { value: 45 },
        { value: 50 },
        { value: 41 },
        { value: 60 },
        { value: 55 },
        { value: 70 },
        { value: 68 },
        { value: 72 },
        { value: 65 },
        { value: 78 },
        { value: 82 },
        { value: 76 },
        { value: 80 },
        { value: 83 },
      ],
    },
    {
      symbol: 'NRN',
      quantity: 40,
      ltp: 590.0,
      sChange: 2.15,
      graph: [
        { value: 12 },
        { value: 22 },
        { value: 25 },
        { value: 28 },
        { value: 32 },
        { value: 38 },
        { value: 40 },
        { value: 45 },
        { value: 48 },
        { value: 53 },
        { value: 56 },
        { value: 61 },
        { value: 65 },
        { value: 70 },
        { value: 75 },
      ],
    },
    {
      symbol: 'UPPER',
      quantity: 80,
      ltp: 390.75,
      sChange: 0.0,
      graph: [
        { value: 20 },
        { value: 22 },
        { value: 25 },
        { value: 21 },
        { value: 24 },
        { value: 26 },
        { value: 27 },
        { value: 29 },
        { value: 28 },
        { value: 30 },
        { value: 31 },
        { value: 33 },
        { value: 32 },
        { value: 34 },
        { value: 35 },
      ],
    },
  ];
  return (
    <View
      style={{
        backgroundColor: colors.background,
        width: '100%',
        paddingVertical: 20,
        paddingHorizontal: 10,
      }}
    >
      <View
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row',
          marginBottom:4,
        }}
      >
        <View
          style={{
            width: 'auto',
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <CustomeDropdown
            filterOptions={filterOptions}
            selectedFilter={selectedFilter}
            setselectedFilter={setSelectedFilter}
            dropDownWith={110}
            placeHolder="Portfolio"
          />
          <Pressable
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Text
              style={{
                color:
                  toggleFilter === 'Best' ? colors.positive : colors.negative,
                fontSize: 14,
              }}
            >
              {toggleFilter}
            </Text>
            <ArrowUpIcon color={colors.positive} width={12} />
          </Pressable>
        </View>
        <View>
          <Text style={{ color: colors.text }}>See more</Text>
        </View>
      </View>
      <View
        style={{ paddingHorizontal: 6, backgroundColor: colors.background }}
      >
        <FlashList
          data={mockStockList}
          keyExtractor={item => item.symbol}
          renderItem={({ item }) => <StockListCard {...item} />}
        />
      </View>
    </View>
  );
};

export default PortfolioList;
