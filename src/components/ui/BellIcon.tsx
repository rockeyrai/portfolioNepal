import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Svg, { Path } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useThemeColors } from "../../utils/ColorTheme";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "../../navigation/types";
import { useNavigation } from "@react-navigation/native";

interface BellButtonProps {
  count: number;
}
type NotificationRoute = NativeStackNavigationProp<AppStackParamList, 'Notification'>;

const BellButton: React.FC<BellButtonProps> = ({ count }) => {
  const rotation = useSharedValue(0);
  const prevCount = useRef(count);
  const routeNotification = useNavigation<NotificationRoute>();
  const {colors} = useThemeColors();

  // Shake animation on new notifications
  useEffect(() => {
    if (count > prevCount.current) {
      rotation.value = withSequence(
        withTiming(-15, { duration: 80 }),
        withTiming(15, { duration: 80 }),
        withTiming(-10, { duration: 80 }),
        withTiming(10, { duration: 80 }),
        withTiming(0, { duration: 80 })
      );
    }
    prevCount.current = count;
  }, [count]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const handlePress = () => {
    routeNotification.navigate("Notification");
  };

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: colors.card }]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Animated.View style={animatedStyle}>
        <Svg viewBox="0 0 448 512" style={styles.bell}>
          <Path
            d="M224 0c-17.7 0-32 14.3-32 32V49.9C119.5 61.4 64 124.2 64 200v33.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416H424c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6C399.5 322.9 384 278.8 384 233.4V200c0-75.8-55.5-138.6-128-150.1V32c0-17.7-14.3-32-32-32zm0 96h8c57.4 0 104 46.6 104 104v33.4c0 47.9 13.9 94.6 39.7 134.6H72.3C98.1 328 112 281.3 112 233.4V200c0-57.4 46.6-104 104-104h8zm64 352H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7s18.7-28.3 18.7-45.3z"
            fill={colors.icon} // use theme icon color
          />
        </Svg>
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
    width: 40,
    height: 40,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  bell: {
    width: 20,
    height: 20,
  },
  badge: {
    position: "absolute",
    top: 2,
    right: 0,
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
    minWidth: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    fontSize: 8,
    fontWeight: "bold",
  },
});

export default BellButton;