import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';

import AuthStack from './auth/AuthStack';
import SubscriptionStack from './subscription/SubscriptionStack';
import AppStack from './AppStack';
import { RootState } from '../redux/store';

const RootStack = createNativeStackNavigator();

const AppNavigator = () => {
  const { token, user } = useSelector((state: RootState) => state.auth);
  const isLoggedIn = !!token;
  const isSubscribed = user?.is_portfolio_subscribed === 1;

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          <RootStack.Screen name="Auth" component={AuthStack} />
        ) : !isSubscribed ? (
          <RootStack.Screen name="Subscription" component={SubscriptionStack} />
        ) : (
          <RootStack.Screen name="App" component={AppStack} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
