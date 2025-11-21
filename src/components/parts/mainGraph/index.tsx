import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LineGraph } from 'react-native-graph';
import { selectedPointValue, SelectionDot } from './CustomSelectionDot';
import { GraphRange } from 'react-native-graph/lib/typescript/LineGraphProps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '../../../utils/ColorTheme';

const COLOR = '#6a7ee7';
const GRADIENT_FILL_COLORS = ['#7476df5D', '#7476df4D', '#7476df00'];

const getMinMax = (points: { date: Date; value: number }[]) => {
  if (!points || points.length === 0) return { min: null, max: null };

  let min = points[0];
  let max = points[0];

  for (const p of points) {
    if (p.value < min.value) min = p;
    if (p.value > max.value) max = p;
  }

  return { min, max };
};

export type GraphPageProps = {
  points: { date: Date; value: number }[];
  isAnimated?: boolean;
  enablePanGesture?: boolean;
  enableFadeInEffect?: boolean;
  enableCustomSelectionDot?: boolean;
  enableGradient?: boolean;
  enableRange?: boolean;
  enableIndicator?: boolean;
  indicatorPulsating?: boolean;
};

export function GraphPage({
  points = [],
  isAnimated = true,
  enablePanGesture = true,
  enableFadeInEffect = true,
  enableCustomSelectionDot = true,
  enableGradient = true,
  enableRange = true,
  enableIndicator = true,
  indicatorPulsating = true,
}: GraphPageProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useThemeColors();
  const { min, max } = useMemo(() => getMinMax(points), [points]);

  const highestDate = useMemo(
    () =>
      points.length !== 0 && points[points.length - 1] != null
        ? points[points.length - 1]!.date
        : undefined,
    [points],
  );
  const range: GraphRange | undefined = useMemo(() => {
    if (!enableRange || points.length === 0 || !highestDate) return undefined;

    const values = points.map(p => p.value);
    const minY = Math.min(...values);
    const maxY = Math.max(...values);

    // Add small padding so line isn’t on the border
    const padding = (maxY - minY) * 0.05;

    return {
      x: {
        min: points[0].date,
        max: new Date(highestDate.getTime()),
      },
      y: {
        min: minY - padding,
        max: maxY + padding,
      },
    };
  }, [enableRange, highestDate, points]);

  return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
            // paddingTop: insets.top + 0,
            // paddingBottom: insets.bottom + 0,
          },
        ]}
      >
        <LineGraph
          style={styles.graph}
          animated={isAnimated}
          color={COLOR}
          points={points}
          gradientFillColors={enableGradient ? GRADIENT_FILL_COLORS : undefined}
          enablePanGesture={enablePanGesture}
          panGestureDelay={0}
          onPointSelected={point => {
            'worklet';
            selectedPointValue.value = point.value;
          }}
          onGestureEnd={() => {}}
          SelectionDot={enableCustomSelectionDot ? SelectionDot : undefined}
          range={range}
          horizontalPadding={enableIndicator ? 5 : 0}
          indicatorPulsating={indicatorPulsating}
          TopAxisLabel={() =>
            max ? (
              <Text style={{ fontSize: 12, color: 'green' }}>
                {max.value.toFixed(2)}
              </Text>
            ) : null
          }
          BottomAxisLabel={() =>
            min ? (
              <Text style={{ fontSize: 12, color: 'red' }}>
                {min.value.toFixed(2)}
              </Text>
            ) : null
          }
        />

        <View style={styles.spacer} />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  spacer: {
    flexGrow: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    paddingHorizontal: 0,
  },
  graph: {
    alignSelf: 'center',
    width: '100%',
    aspectRatio: 1.4,
    marginVertical: 0,
    // paddingHorizontal: 5,
  },
  controlsScrollView: {
    flexGrow: 1,
    paddingHorizontal: 5,
  },
  controlsScrollViewContent: {
    justifyContent: 'center',
  },
});
