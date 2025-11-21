import React, { useState, useRef, useMemo } from 'react';
import { Text, View, TouchableOpacity, Animated } from 'react-native';
import { ChevronDownIcon } from 'lucide-react-native';
import marketQuery from '../../../services/market/index';

const SubIndices = () => {
  const { data: subIndexList = [] } = marketQuery.getSubIndexSummary();
  
  const [open, setOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const heightAnim = useRef(new Animated.Value(0)).current;

  const displayData = useMemo(() => {
    return showAll ? subIndexList : subIndexList.slice(0, 5);
  }, [subIndexList, showAll]);

  const hasMore = subIndexList.length > 5;

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
    outputRange: ['0deg', '180deg'],
  });

  const maxHeight = heightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 500],
  });

  const opacity = heightAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.5, 1],
  });

  return (
    <View
      style={{
        margin: 12,
        padding: 16,
        backgroundColor: '#fff',
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
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#111' }}>
          Subindex
        </Text>

        <Animated.View style={{ transform: [{ rotate: rotation }] }}>
          <ChevronDownIcon size={22} color="#333" />
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
        <View style={{ marginTop: 10 }}>
          {displayData.map((item, index) => (
            <View
              key={item.sindex}
              style={{
                paddingVertical: 10,
                borderBottomWidth: index === displayData.length - 1 && !hasMore ? 0 : 1,
                borderColor: '#eee',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ width: '55%' }}>
                <Text
                  style={{ fontSize: 14, fontWeight: '600', color: '#333' }}
                  numberOfLines={1}
                >
                  {item.sindex}
                </Text>
              </View>

              <View style={{ width: '45%', alignItems: 'flex-end' }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: item.perChange >= 0 ? '#16a34a' : '#dc2626',
                    fontWeight: '600',
                  }}
                >
                  {item.currentValue}
                </Text>

                <Text
                  style={{
                    fontSize: 12,
                    color: item.perChange >= 0 ? '#16a34a' : '#dc2626',
                  }}
                >
                  {item.perChange >= 0 ? '+' : ''}{item.perChange}% ({item.schange})
                </Text>
              </View>
            </View>
          ))}

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
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#2563eb' }}>
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
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#2563eb' }}>
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