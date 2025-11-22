import React, { useCallback } from "react";
import {
  runOnJS,
  useAnimatedReaction,
  useDerivedValue,
  withSpring,
  withTiming,
  useSharedValue,
  makeMutable,
} from "react-native-reanimated";
import { Circle, Group, Text, useFont } from "@shopify/react-native-skia";
import type { SelectionDotProps } from "react-native-graph";
import { useThemeColors } from "../../../utils/ColorTheme";

// ✅ Global shared value (for graph point value)
export const selectedPointValue = makeMutable(0);

export function SelectionDot({
  isActive,
  color,
  circleX,
  circleY,
}: SelectionDotProps): React.ReactElement {
  // ✅ Local animatable states
  const circleRadius = useSharedValue(0);
  const labelOpacity = useSharedValue(0);

  const font = useFont(
    require("../../../assets/font/IBMPlexSans-VariableFont_wdth,wght.ttf"),
    12
  );
  const { colors } = useThemeColors();

  const animateDot = useCallback(
    (active: boolean) => {
      // Animate circle radius
      circleRadius.value = withSpring(active ? 6 : 0, {
        damping: 15,
        stiffness: 200,
      });

      // Animate label opacity
      labelOpacity.value = withTiming(active ? 1 : 0, {
        duration: active ? 150 : 250,
      });
    },
    [circleRadius, labelOpacity]
  );

  useAnimatedReaction(
    () => isActive.value,
    (active) => {
      runOnJS(animateDot)(active);
    },
    [isActive]
  );

  // Derived positions for text label
  const textX = useDerivedValue(() => circleX.value - 18);
  const textY = useDerivedValue(() => circleY.value - 10);

  // Label value from the global mutable value
  const label = useDerivedValue(() => {
    "worklet";
    return selectedPointValue.value.toFixed(2);
  });

  return (
    <Group>
      {/* Floating text label */}
      {font && (
        <Text
          x={textX}
          y={textY}
          font={font}
          text={label}
          color={colors.text}
          opacity={labelOpacity}
        />
      )}

      {/* Main selection circle */}
      <Circle
        cx={circleX}
        cy={circleY}
        r={circleRadius}
        color={color || "#6a7ee7"}
      />
    </Group>
  );
}