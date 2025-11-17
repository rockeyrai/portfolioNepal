import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import AuthStack from './auth/AuthStack';
import SubscriptionStack from './subscription/SubscriptionStack';
import AppStack from './AppStack';
import { RootState } from '../redux/store'; 

const AppNavigator = () => {
  const { token, user } = useSelector((state: RootState) => state.auth);

  const isLoggedIn = !!token;
  const isSubscribed = user?.is_subscribed === 1;

  return (
    <NavigationContainer>
      {!isLoggedIn ? (
        <AuthStack />
      ) : !isSubscribed ? (
        <SubscriptionStack />
      ) : (
        <AppStack />
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;
