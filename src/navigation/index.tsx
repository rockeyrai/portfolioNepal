import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector, shallowEqual } from 'react-redux';
import AuthStack from './auth/AuthStack';
import SubscriptionStack from './subscription/SubscriptionStack';
import AppStack from './AppStack';
import { RootState } from '../redux/store';

const Stack = createNativeStackNavigator();

const RootRouter = () => {
  const { token, user } = useSelector(
    (state: RootState) => ({
      token: state.auth.token,
      user: state.auth.user,
    }),
    shallowEqual
  );

  if (!token) return <AuthStack />;
  if (token && user?.is_portfolio_subscribed !== 1) return <SubscriptionStack />;
  return <AppStack />;
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Only ONE screen — no conditionals */}
        <Stack.Screen name="RootRouter" component={RootRouter} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
