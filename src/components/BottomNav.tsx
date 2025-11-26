import React, { useEffect, useMemo, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Image, Text } from 'react-native';
import Animated, {
  withTiming,
  useAnimatedStyle,
  interpolate,
} from 'react-native-reanimated';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { ChartPie, SquareLibrary, MessagesSquare, CircleUser } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { GradientIcon, GradientText } from './ui/GradientText';
import { useThemeColors } from '../utils/ColorTheme';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const navItems = [
  { name: 'Analysis', icon: ChartPie, route: 'Analysis' },
  { name: 'Test', icon: SquareLibrary, route: 'Test' },
  { name: 'Home', icon: null, route: 'Home' },
  { name: 'Copilot', icon: MessagesSquare, route: 'Copilot' },
  { name: 'Profile', icon: CircleUser, route: 'Profile' },
];

function BottomNav({ state, navigation }: BottomTabBarProps) {

    const renderCount = useRef(0);
    useEffect(() => {
      console.log('AppStack mounted');
      return () => console.log('AppStack unmounted');
    }, []);
    renderCount.current += 1;
  
    console.log(`AppStack rendered ${renderCount.current} times`);
  const { colors } = useThemeColors();

  const activeRoute = state.routes[state.index].name; // <-- FIXED

  const items = useMemo(() => navItems, []);

  return (
    <View style={[styles.container, { borderColor: colors.secondBackground }]}>
      <LinearGradient
        colors={['rgb(64,64,79)', 'rgb(28,28,33)']}
        start={{ x: 0.5, y: 0.2 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.gradient}
      />

      {items.map((item) => {
        const isActive = activeRoute === item.route; // <-- FIXED

        const animStyle = useAnimatedStyle(() => ({
          transform: [{ scale: withTiming(isActive ? 1.2 : 1, { duration: 250 }) }],
        }));

        const labelStyle = useAnimatedStyle(() => ({
          opacity: withTiming(isActive ? 1 : 0.4, { duration: 200 }),
          transform: [{ translateY: withTiming(isActive ? -2 : 2, { duration: 200 }) }],
        }));

        return (
          <AnimatedTouchable
            key={item.route}
            style={styles.navButton}
            onPress={() => navigation.navigate(item.route)}
          >
            <Animated.View style={animStyle}>
              {item.route === 'Home' ? (
                <Image
                  source={require('../assets/logo/portfolio.png')}
                  style={styles.centerImage}
                  resizeMode="contain"
                />
              ) : isActive ? (
                <GradientIcon Icon={item.icon} />
              ) : (
                <item.icon size={24} color="#8a8a8a" />
              )}
            </Animated.View>

            {item.route === 'Home' ? (
              isActive ? (
                <GradientText style={styles.label}>Home</GradientText>
              ) : (
                <Text style={[styles.label, { color: '#8a8a8a' }]}>Home</Text>
              )
            ) : (
              <Animated.View style={labelStyle}>
                {isActive ? (
                  <GradientText style={styles.label}>{item.name}</GradientText>
                ) : (
                  <Text style={[styles.label, { color: '#8a8a8a' }]}>{item.name}</Text>
                )}
              </Animated.View>
            )}
          </AnimatedTouchable>
        );
      })}
    </View>
  );
}


export default React.memo(BottomNav);

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
    borderRadius: 20,
    elevation: 4,
    // overflow: 'hidden',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
  },
  centerImage: {
    width: 35,
    height: 35,
  },
  label: {
    marginTop: 2,
    fontSize: 10,
    fontWeight: '600',
  },
});
