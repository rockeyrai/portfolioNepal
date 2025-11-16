import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SubscriptionStackParamList } from '../types';
import SubscribeScreen from '../../screens/Subscribe';

const Stack = createNativeStackNavigator<SubscriptionStackParamList>();

const SubscriptionStack = () => (
  <Stack.Navigator initialRouteName="Subscribe" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Subscribe" component={SubscribeScreen} />
  </Stack.Navigator>
);

export default SubscriptionStack;
