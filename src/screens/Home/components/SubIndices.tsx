import React, { useState, useRef, useMemo } from 'react';
import { Text, View, TouchableOpacity, Animated } from 'react-native';
import { ChevronDownIcon } from 'lucide-react-native';
import marketQuery from '../../../services/market/index';
import { useThemeColors } from '../../../utils/ColorTheme';
import {
  Banknote,
  Building,
  Factory,
  Hotel,
  Leaf,
  TrendingUp,
  PiggyBank,
  Landmark,
  BriefcaseBusiness,
  Store,
  Waves,
  LineChart,
  ShieldCheck,
} from 'lucide-react-native';

const SubIndices = () => {
  const { data: subIndexList = [] } = marketQuery.getSubIndexSummary();

  const [open, setOpen] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const heightAnim = useRef(new Animated.Value(open ? 1 : 0)).current;
  const rotateAnim = useRef(new Animated.Value(open ? 1 : 0)).current;

  const displayData = useMemo(() => {
    return showAll ? subIndexList : subIndexList.slice(0, 5);
  }, [subIndexList, showAll]);
  const { colors } = useThemeColors();

  const hasMore = subIndexList.length > 5;
  const subIcons: any = {
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
  };

  const toggleOpen = () => {
    const toValue = open ? 0 : 1;
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
    ]).start();

    if (open) {
      setShowAll(false);
    }
  };

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-90deg', '0deg'],
  });

  const maxHeight = heightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 500],
  });

  const opacity = heightAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.5, 1],
  });

  console.log(subIndexList);
  return (
    <View
      style={{
        margin: 12,
        paddingHorizontal: 6,
        paddingVertical:4,
        backgroundColor: colors.background,
        borderRadius: 12,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
      }}
    >
      {/* Header */}
      <TouchableOpacity
        onPress={toggleOpen}
        activeOpacity={0.7}
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
          {displayData.map((item, index) => {
            const Icon = subIcons[item.sindex] || LineChart;

            return (
              <View
                key={item.sindex}
                style={{
                  paddingVertical: 6,
                  // borderBottomWidth:
                  //   index === displayData.length - 1 && !hasMore ? 0 : 1,
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
                  <View style={{backgroundColor:colors.card,borderRadius:25,padding:4}}>
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
                        color:
                          item.perChange >= 0
                            ? colors.positive
                            : colors.negative,
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
                      backgroundColor:
                        item.perChange >= 0 ? colors.positive : colors.negative,
                      fontWeight: 700,
                    }}
                  >
                    {item.perChange >= 0 ? '+' : ''}
                    {item.perChange}%
                  </Text>
                </View>
              </View>
            );
          })}

          {/* View More Button */}
          {hasMore && !showAll && (
            <TouchableOpacity
              onPress={() => setShowAll(true)}
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
          {showAll && (
            <TouchableOpacity
              onPress={() => setShowAll(false)}
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
