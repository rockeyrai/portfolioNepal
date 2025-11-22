import React from 'react';
import BottomNavLayout from '../../layouts/BottomNav';
import ProfileHeader from '../../components/parts/header';
import SummaryDisplay from './components/SummaryDisplay';
import MainNepseGraph from './components/MainNepseGraph';
import SubIndices from './components/SubIndices';
import MarketTab from './components/MarketTab';
import HomeNews from './components/HomeNews';

const HomeScreen = () => {
  return (
    <BottomNavLayout>
      <SubIndices />
      <MarketTab />
      <ProfileHeader />
      <SummaryDisplay />
      <HomeNews/>
      <MainNepseGraph />
    </BottomNavLayout>
  );
};

export default HomeScreen;
