import React from 'react';
import { Text } from 'react-native';
import BottomNavLayout from '../../layouts/BottomNav';
import ProfileHeader from '../../components/parts/header';
import SummaryDisplay from './components/SummaryDisplay';

const HomeScreen = () => {

  return (
    <BottomNavLayout>
      <ProfileHeader />
      <SummaryDisplay/>
    </BottomNavLayout>
  );
};

export default HomeScreen;
