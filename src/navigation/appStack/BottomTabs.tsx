import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../../screens/Home';
import AnalysisScreen from '../../screens/Analysis';
import ServiceScreen from '../../screens/Service';
import CopilotScreen from '../../screens/Copilot';
import ProfileScreen from '../../screens/Profile';
import BottomNav from '../../components/BottomNav';



const Stack = createNativeStackNavigator();

export default function BottomTabs() {
  return (
    <>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Analysis" component={AnalysisScreen} />
        <Stack.Screen name="Service" component={ServiceScreen} />
        <Stack.Screen name="Copilot" component={CopilotScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
      <BottomNav/>
    </>
  );
}
