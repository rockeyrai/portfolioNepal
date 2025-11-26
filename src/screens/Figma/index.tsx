import React from 'react';
import { Image, Text, View } from 'react-native';
import ProfileHeader from '../../components/parts/header';
import TestDisplay from './components/TestDisplay';
import MainChart from './components/MainChart';
import PortfolioList from './components/PortfolioList';

const FigmaDegis = () => {
  return (
    <View>
      <ProfileHeader />

      <TestDisplay />
      <MainChart />
      <PortfolioList />
    </View>
  );
};

export default FigmaDegis;
