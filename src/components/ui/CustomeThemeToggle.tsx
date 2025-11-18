import React, { useMemo } from "react";
import { View, Text, Pressable, Animated, StyleSheet } from "react-native";
import { useThemeColors } from "../../utils/ColorTheme";

const ThemeToggle = () => {
  const { theme, colors, toggleTheme } = useThemeColors();

  const isDark = theme === "dark";

  // Animate the toggle smoothly
  const animatedValue = useMemo(() => new Animated.Value(isDark ? 1 : 0), []);

  const handleToggle = () => {
    Animated.timing(animatedValue, {
      toValue: isDark ? 0 : 1,
      duration: 250,
      useNativeDriver: false,
    }).start();
    toggleTheme();
  };

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 24], // move circle left <-> right
  });

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["#cccccc", "#4296f4"],
  });

  return (
    <View
      style={[
        styles.container,
        // { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <Text style={[styles.label, { color: colors.text }]}>
        {theme.charAt(0).toUpperCase() + theme.slice(1)} mode
      </Text>

      <Pressable onPress={handleToggle} style={styles.switchWrapper}>
        <Animated.View
          style={[styles.switch, { backgroundColor: backgroundColor }]}
        >
          <Animated.View
            style={[
              styles.knob,
              {
                transform: [{ translateX }],
                shadowColor: isDark ? "#000" : "#555",
              },
            ]}
          />
        </Animated.View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginVertical: 8,
    // borderWidth: 1,
  },
  label: {
    // fontSize: 15,
    // fontWeight: "600",
  },
  switchWrapper: {
    padding: 4,
  },
  switch: {
    width: 56,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  knob: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#fff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
});

export default ThemeToggle;