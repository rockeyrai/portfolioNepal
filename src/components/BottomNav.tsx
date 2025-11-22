import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import {
  MessagesSquare,
  CircleUser,
  SquareLibrary,
  ChartPie,
} from 'lucide-react-native';
import { useThemeColors } from '../utils/ColorTheme';
import { GradientIcon, GradientText } from './ui/GradientText';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../navigation/types';
import LinearGradient from 'react-native-linear-gradient';

type BottomNavProp = NativeStackNavigationProp<AppStackParamList>;

type NavItem = {
  name: string;
  icon: any;
  route: keyof AppStackParamList;
  params?: object;
};

export default function BottomNav() {
  const navigation = useNavigation<BottomNavProp>();
  const route =
    useRoute<RouteProp<AppStackParamList, keyof AppStackParamList>>();

  const { colors } = useThemeColors();

  const activeRoute = route.name as keyof AppStackParamList;

  const navItems1: NavItem[] = [
    { name: 'Analysis', icon: ChartPie, route: 'Analysis' },
    { name: 'Service', icon: SquareLibrary, route: 'Service' },
  ];

  const navItems2: NavItem[] = [
    { name: 'Copilot', icon: MessagesSquare, route: 'Copilot' },
    {
      name: 'Profile',
      icon: CircleUser,
      route: 'Profile',
      params: { userId: '123' },
    },
  ];

  const renderNavItem = (item: NavItem) => {
    const isActive = activeRoute === item.route;

    return (
      <TouchableOpacity
        key={item.name}
        style={styles.navButton}
        onPress={() =>
          item.params
            ? navigation.navigate(item.route as any, item.params)
            : navigation.navigate(item.route as any)
        }
      >
        {isActive ? (
          <GradientIcon Icon={item.icon} />
        ) : (
          <item.icon size={24} color="#6b7280" />
        )}
        {isActive ? (
          <GradientText style={styles.label}>{item.name}</GradientText>
        ) : (
          <Text style={styles.label}>{item.name}</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[
        styles.container,
        { borderColor: colors.secondBackground, borderWidth: 0 },
      ]}
    >
      <LinearGradient
        colors={['rgb(64,64,79)', 'rgb(28,28,33)']}
        start={{ x: 0.5, y: 0.2 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.gradient}
      />

      {navItems1.map(renderNavItem)}

      <TouchableOpacity
        style={[styles.navButton, styles.centerButton]}
        onPress={() => {
          console.log('wokring');
          navigation.navigate('Home');
        }}
      >
        <Image
          source={require('../assets/logo/portfolio.png')}
          style={styles.centerImage}
          resizeMode="contain"
        />
        {activeRoute === 'Home' ? (
          <GradientText style={styles.label}>Home</GradientText>
        ) : (
          <Text style={styles.label}>Home</Text>
        )}
      </TouchableOpacity>

      {navItems2.map(renderNavItem)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 10,
    left: '5%',
    right: '5%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 45,
    borderTopWidth: 0,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
    // overflow:"hidden"
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20, // important to clip gradient within container
  },
  navButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
  },
  centerButton: {
    marginBottom: 5,
  },
  centerImage: {
    width: 40,
    height: 40,
    backgroundColor: 'transparent',
  },
  label: {
    marginTop: 0,
    fontSize: 8,
    color: '#6b7280',
  },
});
