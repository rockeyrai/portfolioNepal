import React from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import ProfileHeader from '../../components/parts/header';
import TestDisplay from './components/TestDisplay';
import MainChart from './components/MainChart';
import PortfolioList from './components/PortfolioList';
import MinGraph from '../../components/ui/MinGraph';
import StockListCard from '../../components/ui/StockListCard';
import { FlashList } from '@shopify/flash-list';
import { useThemeColors } from '../../utils/ColorTheme';

const FigmaDegis = () => {
  const { colors } = useThemeColors();

  return (
    <View>
      <ProfileHeader />{' '}
      <ScrollView
        contentContainerStyle={{ paddingBottom: 90 }}
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: colors.background }}
      >
        <TestDisplay />
        <MainChart />
        <PortfolioList />
      </ScrollView>
    </View>
  );
};

export default FigmaDegis;
