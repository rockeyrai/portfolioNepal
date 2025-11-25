import React from 'react';
import HomeScreen from '../../screens/Home';
import AnalysisScreen from '../../screens/Analysis';
import ServiceScreen from '../../screens/Service';
import CopilotScreen from '../../screens/Copilot';
import ProfileScreen from '../../screens/Profile';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import BottomNav from '../../components/BottomNav';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <BottomNav {...props} />} // your custom nav
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Analysis" component={AnalysisScreen} />
      <Tab.Screen name="Service" component={ServiceScreen} />
      <Tab.Screen name="Copilot" component={CopilotScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
