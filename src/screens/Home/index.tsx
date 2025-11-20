import React from 'react';
import { Text } from 'react-native';
import Config from 'react-native-config';
import BottomNavLayout from '../../layouts/BottomNav';
import ProfileHeader from '../../components/parts/header';

const HomeScreen = () => {
  return (
    <BottomNavLayout>
      <ProfileHeader />
    </BottomNavLayout>
  );
};

export default HomeScreen;
