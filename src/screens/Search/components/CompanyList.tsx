import React, { memo, useState, useCallback, useEffect, useMemo } from 'react';
import {
  Image,
  Pressable,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Plus } from 'lucide-react-native';
import FallbackLogo from '../../../assets/logo/portfolio.png';
import { useThemeColors } from '../../../utils/ColorTheme';

type CompanyRowProps = {
  item: {
    symbol: string;
    companyName?: string;
    sectorName?: string;
  };
  logoBaseURL: string;
  onPress: (symbol: string) => void;
  onBookmark: (symbol: string) => void;
};

const CompanyRow = ({
  item,
  logoBaseURL,
  onPress,
  onBookmark,
}: CompanyRowProps) => {
  const { colors } = useThemeColors();
  const [imageError, setImageError] = useState(false);
  const rowStyles = useMemo(
    () => ({
      container: {
        ...styles.container,
        backgroundColor: colors.secondBackground,
      },
      text: { color: colors.text + 'AA' },
    }),
    [colors],
  );

  // FIX 1: Reset error state when the item changes (Recycling handling)
  useEffect(() => {
    setImageError(false);
  }, [item.symbol]);

  const handlePress = useCallback(() => {
    onPress(item.symbol);
  }, [item.symbol, onPress]);

  const handleBookmarkPress = useCallback(() => {
    onBookmark(item.symbol);
  }, [item.symbol, onBookmark]);

  return (
    <Pressable
      style={[styles.container, { backgroundColor: colors.secondBackground }]}
      onPress={handlePress}
    >
      <View
        style={[
          styles.logoContainer,
          { backgroundColor: colors.secondBackground },
        ]}
      >
        {/* FIX 2: Add key={item.symbol}. 
           This forces React to treat this as a new Image instance when data changes,
           preventing it from showing the previous row's cached/broken image.
        */}
        <Image
          key={item.symbol}
          source={
            imageError
              ? FallbackLogo
              : { uri: `${logoBaseURL}/${item.symbol}.webp` }
          }
          onError={() => setImageError(true)}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.textContainer}>
        <View style={styles.headerRow}>
          <Text style={[styles.symbolText, { color: colors.text }]}>
            {item.symbol}
          </Text>
          <Text
            style={[
              styles.sectorBadge,
              { color: colors.text, backgroundColor: colors.background },
            ]}
          >
            {item.sectorName}
          </Text>
        </View>

        <Text numberOfLines={1} ellipsizeMode="tail" style={rowStyles.text}>
          {item.companyName}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.bookmarkContainer}
        onPress={handleBookmarkPress}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <View
          style={[
            styles.bookmarkButton,
            { backgroundColor: colors.background },
          ]}
        >
          <Plus size={25} strokeWidth={1} color={colors.text} />
        </View>
      </TouchableOpacity>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 2,
    flexDirection: 'row',
    alignItems: 'center',
    // FIX 3: Remove marginBottom if using ItemSeparatorComponent,
    // or keep it consistent. Ensure height matches estimatedItemSize
    height: 60,
    width: '100%',
  },
  logoContainer: {
    width: 40, // Increased slightly for better touch target/visuals
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    overflow: 'hidden',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    flex: 1,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  symbolText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  sectorBadge: {
    fontSize: 11,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
    overflow: 'hidden',
  },
  companyNameText: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 4,
  },
  bookmarkContainer: {
    width: 40,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookmarkButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// Using compare function helps slightly with performance but memo is usually enough
export default memo(CompanyRow);
