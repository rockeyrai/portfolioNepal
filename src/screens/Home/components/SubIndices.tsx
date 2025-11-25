import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { Text, View, TouchableOpacity, Animated } from 'react-native';
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

const SubIndices = () => {
    const renderCount = useRef(0);
    useEffect(() => {
      console.log('subindex component mounted');
      return () => console.log('subindex component unmounted');
    }, []);
    renderCount.current += 1;
  
    console.log(`subindex component rendered ${renderCount.current} times`);


  const { data: subIndexList = [] } = marketQuery.getSubIndexSummary();
  const { colors } = useThemeColors();

  const [open, setOpen] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const heightAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(1)).current;

  // Memoize subIcons object
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

  console.log("component re-render")
  // Memoize display data to prevent unnecessary recalculations
  const displayData = useMemo(() => {
    // Only compute when component is open
    if (!open) return [];
    return showAll ? subIndexList : subIndexList.slice(0, 5);
  }, [subIndexList, showAll, open]);

  const hasMore = subIndexList.length > 5;

  // Memoize animation interpolations
  const rotation = useMemo(() => rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-90deg', '0deg'],
  }), [rotateAnim]);

  const maxHeight = useMemo(() => heightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 700],
  }), [heightAnim]);

  const opacity = useMemo(() => heightAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.5, 1],
  }), [heightAnim]);

  // Optimize toggle function with useCallback
  const toggleOpen = useCallback(() => {
    // Prevent toggling during animation
    if (isAnimating) return;

    const toValue = open ? 0 : 1;
    setIsAnimating(true);
    setOpen(!open);

    Animated.parallel([
      Animated.timing(rotateAnim, {
        toValue,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(heightAnim, {
        toValue,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start(() => {
      setIsAnimating(false);
      // Reset showAll when closing
      if (open) {
        setShowAll(false);
      }
    });
  }, [open, isAnimating, rotateAnim, heightAnim]);

  // Memoize view more/less handlers
  const handleViewMore = useCallback(() => {
    setShowAll(true);
  }, []);

  const handleViewLess = useCallback(() => {
    setShowAll(false);
  }, []);

  return (
    <View
      style={{
        margin: 12,
        // paddingHorizontal: 6,
        paddingVertical: 10,
        backgroundColor: colors.background,
        borderBottomWidth:1,
        borderTopWidth:1,
        borderColor:colors.secondBackground
        // borderRadius: 12,
        // elevation: 3,
        // shadowColor: '#000',
        // shadowOpacity: 0.1,
        // shadowRadius: 6,
      }}
    >
      {/* Header */}
      <TouchableOpacity
        onPress={toggleOpen}
        activeOpacity={0.7}
        disabled={isAnimating}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text }}>
          Subindex
        </Text>

        <Animated.View style={{ transform: [{ rotate: rotation }] }}>
          <ChevronDownIcon size={15} color={colors.text} />
        </Animated.View>
      </TouchableOpacity>

      {/* Collapsible Content */}
      <Animated.View
        style={{
          maxHeight,
          opacity,
          overflow: 'hidden',
        }}
      >
        <View style={{ marginTop: 8 }}>
          {displayData.map((item) => (
            <SubIndexItem
              key={item.sindex}
              item={item}
              colors={colors}
              subIcons={subIcons}
            />
          ))}

          {/* View More Button */}
          {hasMore && !showAll && open && (
            <TouchableOpacity
              onPress={handleViewMore}
              activeOpacity={0.7}
              style={{
                paddingVertical: 12,
                alignItems: 'center',
              }}
            >
              <Text
                style={{ fontSize: 14, fontWeight: '600', color: '#2563eb' }}
              >
                View More ({subIndexList.length - 5} more)
              </Text>
            </TouchableOpacity>
          )}

          {/* View Less Button */}
          {showAll && open && (
            <TouchableOpacity
              onPress={handleViewLess}
              activeOpacity={0.7}
              style={{
                paddingVertical: 12,
                alignItems: 'center',
              }}
            >
              <Text
                style={{ fontSize: 14, fontWeight: '600', color: '#2563eb' }}
              >
                View Less
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    </View>
  );
};

export default SubIndices;