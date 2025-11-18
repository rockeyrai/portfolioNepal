import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/Home';
import ProfileScreen from '../screens/Profile';
import { AppStackParamList } from './types';
import AnalysisScreen from '../screens/Analysis';
import ServiceScreen from '../screens/Service';
import CopilotScreen from '../screens/Copilot';

const Stack = createNativeStackNavigator<AppStackParamList>();

const AppStack = () => (
  <Stack.Navigator initialRouteName="Home">
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="Analysis" component={AnalysisScreen} />
    <Stack.Screen name="Service" component={ServiceScreen} />
    <Stack.Screen name="Copilot" component={CopilotScreen} />
  </Stack.Navigator>
);

export default AppStack;
