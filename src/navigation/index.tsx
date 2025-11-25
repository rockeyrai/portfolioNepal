// src/navigation/index.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector, shallowEqual } from 'react-redux';

import { RootState } from '../redux/store';
import AuthStack from './auth/AuthStack';
import SubscriptionStack from './subscription/SubscriptionStack';
import AppStack from './AppStack';

const RootStack = createNativeStackNavigator();

const AppNavigator = () => {
  const { token, user } = useSelector(
    (state: RootState) => ({
      token: state.auth.token,
      user: state.auth.user,
    }),
    shallowEqual
  );

  const isLoggedIn = !!token;
  const isSubscribed = user?.is_portfolio_subscribed === 1;

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {/* Always call Screen components to preserve hook order */}
        {!isLoggedIn && <RootStack.Screen name="Auth" component={AuthStack} />}
        {isLoggedIn && !isSubscribed && (
          <RootStack.Screen name="Subscription" component={SubscriptionStack} />
        )}
        {isLoggedIn && isSubscribed && <RootStack.Screen name="App" component={AppStack} />}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
