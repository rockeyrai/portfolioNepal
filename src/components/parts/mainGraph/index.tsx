import React, { useEffect, useMemo, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
// import { LineGraph } from 'react-native-graph';
import { selectedPointValue, SelectionDot } from './CustomSelectionDot';
import { GraphRange } from 'react-native-graph/lib/typescript/LineGraphProps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '../../../utils/ColorTheme';
import { LineGraph } from 'react-native-graph';

const COLOR = '#6a7ee7';
const GRADIENT_FILL_COLORS = ['#7476df5D', '#7476df4D', '#7476df00'];

// ---------------------------
// Normalize API response
// ---------------------------
const normalizeApiPoints = (raw: any[]) => {
  if (!raw || raw.length === 0) return [];

  return raw.map(item => {
    const timestamp = item.t * 1000;
    const date = new Date(timestamp);
    console.log('date object', date); // shows Date
    console.log('date ISO string', date.toISOString()); // more readable
    const d = new Date();
    console.log(d); // shows {}
    console.log(d.toISOString()); // shows full date string
    console.log(d.getTime()); // shows timestamp

    return {
  date: item.t * 1000, // as number
      value: Number(item.l),
    };
  });

  // });
  // return raw.map(item => ({

  //   date: new Date(Number(item.t) * 1000).toISOString(),
  //   value: Number(item.l),
  // }));
};

console.log(
  'Converted Date:',
  new Date(Number(1764135384) * 1000).toISOString(),
);

export type GraphPageProps = {
  points: any[]; // Raw API points
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

  const renderCount = useRef(0);
  useEffect(() => {
    console.log('MainGRaph mounted');
    return () => console.log('MainGRaph unmounted');
  }, []);
  renderCount.current += 1;

  console.log(`MainGRaph rendered ${renderCount.current} times`);
  // ---------------------------
  // Memoize normalized points
  // ---------------------------
  const normalizedPoints = useMemo(() => normalizeApiPoints(points), [points]);

  console.log(normalizedPoints);
  // ---------------------------
  // Calculate graph range
  // ---------------------------

  const range: GraphRange | undefined = useMemo(() => {
    if (!enableRange || normalizedPoints.length === 0) return undefined;

    const values = normalizedPoints.map(p => p.value);
    const dates = normalizedPoints.map(p => p.date);

    const minY = Math.min(...values);
    const maxY = Math.max(...values);

    const minX = new Date(Math.min(...dates.map(d => d.getTime())));
    const maxX = new Date(Math.max(...dates.map(d => d.getTime())));

    return {
      x: {
        min: minX,
        max: maxX,
      },
      y: {
        min: minY,
        max: maxY,
      },
    };
  }, [enableRange, normalizedPoints]);

  return (
    <View
      style={[styles.container, { backgroundColor: colors.secondBackground }]}
    >
      <LineGraph
        style={styles.graph}
        points={normalizedPoints}
        // gradientFillColors={enableGradient ? GRADIENT_FILL_COLORS : undefined}
        enablePanGesture={enablePanGesture}
        panGestureDelay={0}
        onPointSelected={point => {
          'worklet';
          selectedPointValue.value = point.value;
        }}
        animated={true}
        color={COLOR}
        onGestureEnd={() => {}}
        SelectionDot={enableCustomSelectionDot ? SelectionDot : undefined}
        range={range}
        horizontalPadding={enableIndicator ? 25 : 0}
        indicatorPulsating={indicatorPulsating}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 150,
    marginBottom: 5,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  graph: {
    alignSelf: 'center',
    width: '100%',
    height: '100%',
    marginVertical: 0,
    paddingVertical: 0,
  },
});
