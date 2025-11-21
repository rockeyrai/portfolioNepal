import React from 'react';
import BottomNavLayout from '../../layouts/BottomNav';
import ProfileHeader from '../../components/parts/header';
import SummaryDisplay from './components/SummaryDisplay';
import MainNepseGraph from './components/MainNepseGraph';
import SubIndices from './components/SubIndices';


const HomeScreen = () => {

  return (
    <BottomNavLayout>
        <SubIndices/>

        <ProfileHeader />
        <SummaryDisplay />
        <MainNepseGraph/>
    </BottomNavLayout>
  );
};

export default HomeScreen;
