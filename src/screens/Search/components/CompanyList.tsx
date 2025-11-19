import React, { useEffect, useState, useCallback, memo } from 'react';
import { Image, Pressable, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Plus } from 'lucide-react-native';
import FallbackLogo from '../../../assets/logo/portfolio.png';
import { useThemeColors } from '../../../utils/ColorTheme';
import { incrementSearchCount } from '../../../utils/searchHistory';
import { AppStackParamList } from '../../../navigation/types';

type CompanyScreenProp = NativeStackNavigationProp<AppStackParamList, 'Company'>;

type CompanyRowProps = {
  item: {
    symbol: string;
    companyName?: string;
    sectorName?: string;
  };
  logoBaseURL: string;
};

const CompanyRow = memo(({ item, logoBaseURL }: CompanyRowProps) => {
  const { colors } = useThemeColors();
  const companyRouter = useNavigation<CompanyScreenProp>();
  const [imageError, setImageError] = useState(false);

  const logoUrl = `${logoBaseURL}/${item.symbol}.webp`;

  // Reset fallback when symbol changes
  useEffect(() => {
    setImageError(false);
  }, [item.symbol]);

  // Memoized navigation handler
  const handleSelectCompany = useCallback(async () => {
    await incrementSearchCount(item.symbol);
    companyRouter.navigate('Company', { symbol: item.symbol });
  }, [item.symbol, companyRouter]);

  // Memoized image error handler
  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  // Memoized bookmark handler
  const handleBookmark = useCallback(() => {
    console.log('Bookmarked:', item.symbol);
  }, [item.symbol]);

  return (
    <View style={[styles.container, { backgroundColor: colors.secondBackground }]}>
      {/* Left: Logo */}
      <Pressable
        style={[styles.logoContainer, { backgroundColor: colors.secondBackground }]}
        onPress={handleSelectCompany}
      >
        <Image
          source={imageError ? FallbackLogo : { uri: logoUrl }}
          onError={handleImageError}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </Pressable>

      {/* Middle: Text Section */}
      <View style={styles.textContainer}>
        <View style={styles.headerRow}>
          <Text style={[styles.symbolText, { color: colors.text }]}>
            {item.symbol}
          </Text>
          <Text
            style={[
              styles.sectorBadge,
              { color: colors.text, backgroundColor: colors.secondBackground }
            ]}
          >
            {item.sectorName}
          </Text>
        </View>

        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={[styles.companyNameText, { color: colors.text + 'AA' }]}
        >
          {item.companyName}
        </Text>
      </View>

      {/* Right: Bookmark */}
      <TouchableOpacity
        style={styles.bookmarkContainer}
        onPress={handleBookmark}
      >
        <View
          style={[
            styles.bookmarkButton,
            { backgroundColor: colors.secondBackground + '60' }
          ]}
        >
          <Plus size={25} strokeWidth={1} color={colors.text} />
        </View>
      </TouchableOpacity>
    </View>
  );
});

CompanyRow.displayName = 'CompanyRow';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 2,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    borderRadius: 10,
  },
  logoContainer: {
    width: '15%',
    alignItems: 'center',
    borderRadius: 25,
    padding: 2,
    aspectRatio: 1,
    justifyContent: 'center',
  },
  logoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
  },
  textContainer: {
    width: '70%',
    paddingHorizontal: 6,
  },
  headerRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  symbolText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  sectorBadge: {
    fontSize: 12,
    paddingVertical: 1,
    paddingHorizontal: 4,
    borderRadius: 10,
  },
  companyNameText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
  },
  bookmarkContainer: {
    width: '15%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookmarkButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CompanyRow;