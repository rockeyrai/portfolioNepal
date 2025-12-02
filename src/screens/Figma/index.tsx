import React from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import ProfileHeader from '../../components/parts/header';
import TestDisplay from './components/TestDisplay';
import MainChart from './components/MainChart';
import MinGraph from '../../components/ui/MinGraph';
import StockListCard from '../../components/ui/StockListCard';
import { FlashList } from '@shopify/flash-list';
import { useThemeColors } from '../../utils/ColorTheme';
import SwipCard from '../../components/ui/swipCard';
import TestSwip from '../../components/ui/swipCard';
import StockList from './components/StockList';

const FigmaDegis = () => {
  const { colors } = useThemeColors();

  return (
    <View>
      <ProfileHeader />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: colors.background }}
      >
        <TestDisplay />
        {/* <MainChart /> */}
        {/* <SwipCard/> */}
        <StockList />
      </ScrollView>
    </View>
  );
};

export default FigmaDegis;
