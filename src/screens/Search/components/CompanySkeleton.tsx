import React from 'react';
import { View } from 'react-native';
import { useThemeColors } from '../../../utils/ColorTheme';
import { Plus } from 'lucide-react-native';

const CompanySkeletonRow = () => {
  const { colors } = useThemeColors();

  return (
    <View
      style={{
        paddingHorizontal: 12,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
        backgroundColor: colors.background,
      }}
    >
      {/* Left circle skeleton */}
      <View
        style={{
          width: '15%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            width: 35,
            height: 35,
            borderRadius: 16,
            backgroundColor: colors.text + '20',
          }}
        />
      </View>

      {/* Middle texts */}
      <View style={{ width: '75%', paddingHorizontal: 6 }}>
        {/* Symbol skeleton */}
        <View
          style={{
            width: '30%',
            height: 12,
            backgroundColor: colors.text + '20',
            borderRadius: 6,
            marginBottom: 8,
          }}
        />

        {/* Company name skeleton */}
        <View
          style={{
            width: '70%',
            height: 10,
            backgroundColor: colors.text + '20',
            borderRadius: 6,
          }}
        />
      </View>

      {/* Right circular button skeleton */}
      <View
        style={{
          width: '10%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: colors.text + '20',
          }}
        /> */}
        <Plus size={20} strokeWidth={2} color={colors.text + '70'} />
      </View>
    </View>
  );
};

export default CompanySkeletonRow;
