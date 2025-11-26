import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useThemeColors } from '../../utils/ColorTheme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/types';
import { useNavigation } from '@react-navigation/native';
import { Bell } from 'lucide-react-native';

interface BellButtonProps {
  count: number;
}
type NotificationRoute = NativeStackNavigationProp<
  AppStackParamList,
  'Notification'
>;

const BellButton: React.FC<BellButtonProps> = ({ count }) => {
  const rotation = useSharedValue(0);
  const prevCount = useRef(count);
  const routeNotification = useNavigation<NotificationRoute>();
  const { colors } = useThemeColors();

  // Shake animation on new notifications
  useEffect(() => {
    if (count > prevCount.current) {
      rotation.value = withSequence(
        withTiming(-15, { duration: 80 }),
        withTiming(15, { duration: 80 }),
        withTiming(-10, { duration: 80 }),
        withTiming(10, { duration: 80 }),
        withTiming(0, { duration: 80 }),
      );
    }
    prevCount.current = count;
  }, [count]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const handlePress = () => {
    routeNotification.navigate('Notification');
  };

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: colors.secondBackground }]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Animated.View style={animatedStyle}>
        <Bell  strokeWidth={1} size={18} color={colors.text} />
      </Animated.View>

      {count > 0 && (
        <View
          style={[
            styles.badge,
            { backgroundColor: colors.negative }, // theme negative color
          ]}
        >
          <Text style={[styles.badgeText, { color: colors.text }]}>
            {count}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 35,
    height: 35,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bell: {
    width: 18,
    height: 18,
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 0,
    borderRadius: 8,
    // paddingHorizontal: 4,
    // paddingVertical: 1,
    // minWidth: 16,
    aspectRatio:1,
    width:14,
    display:"flex",
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 8,
    fontWeight: 'bold',
  },
});

export default BellButton;
