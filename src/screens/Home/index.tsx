import React, { useEffect, useRef } from 'react';
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
  //  logAllStorage();j
  // clearSearchHistory()
  const { colors } = useThemeColors();
  const renderCount = useRef(0);
  useEffect(() => {
    console.log('homepage mounted');
    return () => console.log('homepage unmounted');
  }, []);
  renderCount.current += 1;

  console.log(`homepage rendered ${renderCount.current} times`);
  return (
    <>
      <ProfileHeader />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 70 }}
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: colors.background }}
      >
        <SummaryDisplay />
        {/* <MainNepseGraph /> */}
        <MarketTab />
        <SubIndices />
        <HomeNews />
      </ScrollView>
    </>
  );
};

export default HomeScreen;
