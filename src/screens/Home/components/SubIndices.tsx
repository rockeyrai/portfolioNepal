import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { Text, View, TouchableOpacity,  } from 'react-native';
import { ChevronDownIcon, LineChart } from 'lucide-react-native';
import marketQuery from '../../../services/market/index';
import { useThemeColors } from '../../../utils/ColorTheme';
import {
  Banknote,
  Building,
  Factory,
  Hotel,
  TrendingUp,
  PiggyBank,
  Landmark,
  BriefcaseBusiness,
  Store,
  Waves,
  ShieldCheck,
} from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from "react-native-reanimated";
// Move SubIndexItem outside as a separate component
const SubIndexItem = React.memo(({ item, colors, subIcons }) => {
  const Icon = subIcons[item.sindex] || LineChart;

  console.log("list render")
  return (
    <View
      style={{
        paddingVertical: 6,
        borderColor: '#eee',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <View
        style={{
          width: '55%',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <View style={{
          backgroundColor: colors.card,
          borderRadius: 25,
          padding: 4
        }}>
          <Icon size={20} color={colors.text} />
        </View>

        <View>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '700',
              color: colors.text,
            }}
            numberOfLines={1}
          >
            {item.sindex}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: item.perChange >= 0 ? colors.positive : colors.negative,
              fontWeight: '600',
            }}
          >
            {item?.schange}
          </Text>
        </View>
      </View>

      <View
        style={{
          width: '45%',
          alignItems: 'flex-end',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          gap: 6,
        }}
      >
        <Text
          style={{
            fontSize: 14,
            color: colors.text,
            fontWeight: '600',
          }}
        >
          {item.currentValue}
        </Text>

        <Text
          style={{
            fontSize: 12,
            color: colors.optext,
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 6,
            backgroundColor: item.perChange >= 0 ? colors.positive : colors.negative,
            fontWeight: '700',
          }}
        >
          {item.perChange >= 0 ? '+' : ''}
          {item.perChange}%
        </Text>
      </View>
    </View>
  );
});


const  SubIndices=()=> {
  const { data: subIndexList = [] } = marketQuery.getSubIndexSummary();
  const { colors } = useThemeColors();

  const [showAll, setShowAll] = useState(false);

  const open = useSharedValue(1);
  const rotate = useSharedValue(1);

  const displayData = useMemo(() => {
    if (open.value === 0) return [];
    return showAll ? subIndexList : subIndexList.slice(0, 5);
  }, [subIndexList, showAll, open.value]);

  const animatedContentStyle = useAnimatedStyle(() => ({
    maxHeight: interpolate(open.value, [0, 1], [0, 700]),
    opacity: interpolate(open.value, [0, 1], [0, 1]),
    overflow: "hidden",
  }));

  const rotateStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${interpolate(rotate.value, [0, 1], [-90, 0])}deg`,
      },
    ],
  }));
  const subIcons = useMemo(() => ({
    'Micro Finance': PiggyBank,
    'Life Insurance': ShieldCheck,
    'Mutual Fund': Banknote,
    Investment: BriefcaseBusiness,
    'Commercial Banks': Landmark,
    'Hotels And Tourism': Hotel,
    Others: Store,
    'Hydro Power': Waves,
    'Development Banks': Building,
    'Manufacturing And Processing': Factory,
    'Non Life Insurance': ShieldCheck,
    Finance: PiggyBank,
    Tradings: TrendingUp,
  }), []);
  const toggleOpen = () => {
    const toValue = open.value === 1 ? 0 : 1;

    open.value = withTiming(toValue, { duration: 400 });
    rotate.value = withTiming(toValue, { duration: 400 });

    if (toValue === 0) setShowAll(false);
  };

  return (
    <View style={{ margin: 12, paddingVertical: 10 , borderBottomWidth:1, borderTopWidth:1, borderColor:colors.secondBackground }}>
      {/* Header */}
      <TouchableOpacity
        onPress={toggleOpen}
        activeOpacity={0.7}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "700", color: colors.text }}>
          Subindex
        </Text>

        <Animated.View style={rotateStyle}>
          <ChevronDownIcon size={15} color={colors.text} />
        </Animated.View>
      </TouchableOpacity>

      {/* Animated Body */}
      <Animated.View style={animatedContentStyle}>
        <View style={{ marginTop: 8 }}>
          {displayData.map((item) => (
            <SubIndexItem
              key={item.sindex}
              item={item}
              colors={colors}
              subIcons={subIcons}
            />
          ))}

          {/* View More */}
          {subIndexList.length > 5 && !showAll && (
            <TouchableOpacity
              onPress={() => setShowAll(true)}
              style={{ paddingVertical: 12, alignItems: "center" }}
            >
              <Text style={{ color: "#2563eb", fontWeight: "600" }}>
                View More ({subIndexList.length - 5} more)
              </Text>
            </TouchableOpacity>
          )}

          {/* View Less */}
          {showAll && (
            <TouchableOpacity
              onPress={() => setShowAll(false)}
              style={{ paddingVertical: 12, alignItems: "center" }}
            >
              <Text style={{ color: "#2563eb", fontWeight: "600" }}>
                View Less
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    </View>
  );
}


export default SubIndices;