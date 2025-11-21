import React from 'react';
import BottomNavLayout from '../../layouts/BottomNav';
import ProfileHeader from '../../components/parts/header';
import SummaryDisplay from './components/SummaryDisplay';
import MainNepseGraph from './components/MainNepseGraph';


const HomeScreen = () => {

  return (
    <BottomNavLayout>
        <ProfileHeader />
        <SummaryDisplay />
        <MainNepseGraph/>
    </BottomNavLayout>
  );
};

export default HomeScreen;
