import React from 'react';
import BottomNavLayout from '../../layouts/BottomNav';
import ProfileHeader from '../../components/parts/header';
import SummaryDisplay from './components/SummaryDisplay';
import MainNepseGraph from './components/MainNepseGraph';
import SubIndices from './components/SubIndices';
import MarketTab from './components/MarketTab';


const HomeScreen = () => {

  return (
    <BottomNavLayout>
        <SubIndices/>
<MarketTab/>
        <ProfileHeader />
        <SummaryDisplay />
        <MainNepseGraph/>
    </BottomNavLayout>
  );
};

export default HomeScreen;
