import React from 'react';
import BottomNavLayout from '../../layouts/BottomNav';
import ProfileHeader from '../../components/parts/header';
import SummaryDisplay from './components/SummaryDisplay';
import MainNepseGraph from './components/MainNepseGraph';
import SubIndices from './components/SubIndices';
import MarketTab from './components/MarketTab';
import HomeNews from './components/HomeNews';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { clearSearchHistory } from '../../utils/searchHistory';
import { ScrollView } from 'react-native';
import { useThemeColors } from '../../utils/ColorTheme';

const HomeScreen = () => {
  //  logAllStorage();
  // clearSearchHistory()
  const { colors } = useThemeColors();

  return (
    <BottomNavLayout>
      <ProfileHeader />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 70 }}
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: colors.background }}
      >
        <SummaryDisplay />
        <MainNepseGraph />
        <MarketTab />
        <SubIndices />
        <HomeNews />
      </ScrollView>
    </BottomNavLayout>
  );
};

export default HomeScreen;
