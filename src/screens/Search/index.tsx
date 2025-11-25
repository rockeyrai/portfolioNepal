import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  TextInput,
  Text,
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
  InteractionManager,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { ArrowLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import Config from 'react-native-config';

import { useThemeColors } from '../../utils/ColorTheme';
import { getActiveCompanyNames } from '../../services/company';
import {
  getSearchHistory,
  incrementSearchCount,
} from '../../utils/searchHistory';
import BottomNavLayout from '../../layouts/BottomNav';
import CompanyRow from './components/CompanyList';
import CompanySkeletonRow from './components/CompanySkeleton';

// Type definitions
type Company = {
  symbol: string;
  companyName?: string;
  sectorName?: string;
};

const SearchScreen = () => {
  const { colors } = useThemeColors();
  const navigation = useNavigation<any>();
  const { data: companies = [], isLoading: isDataLoading } =
    getActiveCompanyNames();

    console.log(companies)
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [searchHistory, setSearchHistory] = useState<Record<string, number>>(
    {},
  );
  const [isTransitionFinished, setIsTransitionFinished] = useState(false);

  const logoBaseURL = Config.COMPANY_LOGO_URL;

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      setIsTransitionFinished(true);
      getSearchHistory().then(setSearchHistory);
    });
    return () => task.cancel();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleCompanyPress = useCallback(
    async (symbol: string) => {
      console.log('working');
      navigation.navigate('Company', { symbol });
      await incrementSearchCount(symbol);
    },
    [navigation],
  );

  const handleBookmark = useCallback((symbol: string) => {
    console.log(`Added to bookmark: ${symbol}`);
  }, []);

  const finalList = useMemo(() => {
    if (!companies.length) return [];

    const query = debouncedSearch.trim().toLowerCase();
    let results = companies;

    if (query) {
      results = companies.filter(item => {
        return (
          (item.symbol && item.symbol.toLowerCase().includes(query)) ||
          (item.companyName && item.companyName.toLowerCase().includes(query))
        );
      });
    }

    if (Object.keys(searchHistory).length > 0) {
      results = [...results].sort((a, b) => {
        const countA = searchHistory[a.symbol] || 0;
        const countB = searchHistory[b.symbol] || 0;
        return countB - countA;
      });
    }

    if (!query) {
      const top = results.slice(0, 3);
      const rest = results.slice(3);
      return [...top, ...rest];
    }

    return results;
  }, [debouncedSearch, companies, searchHistory]);

  const renderItem = useCallback(
    ({ item }: { item: Company }) => (
      <CompanyRow
        item={item}
        logoBaseURL={logoBaseURL}
        onPress={handleCompanyPress}
        onBookmark={handleBookmark}
      />
    ),
    [logoBaseURL, handleCompanyPress, handleBookmark],
  );

  const showSkeleton = !isTransitionFinished || isDataLoading;
  const keyExtractor = useCallback((item: Company) => item.symbol, []);
  return (
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: colors.background }]}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {/* FIXED HEADER - Outside of scrollable area */}
          <View style={styles.headerContainer}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={styles.iconContainer}
              hitSlop={10}
            >
              <ArrowLeft color={colors.text} />
            </Pressable>

            <TextInput
              placeholder="Search company"
              placeholderTextColor={colors.text + '80'}
              style={[
                styles.searchInput,
                {
                  color: colors.text,
                  backgroundColor: colors.secondBackground,
                },
              ]}
              value={search}
              onChangeText={setSearch}
              autoCapitalize="none"
              returnKeyType="search"
              autoCorrect={false}
            />
          </View>

          {/* SCROLLABLE CONTENT AREA - Separate from header */}
          <View style={styles.listContainer}>
            {showSkeleton ? (
              // ... skeleton code
              <FlashList
                data={Array.from({ length: 12 })}
                estimatedItemSize={60}
                renderItem={() => <CompanySkeletonRow />}
                scrollEnabled={false}
              />
            ) : (
              <FlashList<Company>
                data={finalList}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                estimatedItemSize={60} // Must match the exact height of CompanyRow styles
                // OPTIMIZATION SETTINGS
                drawDistance={500} // Lowering this slightly can sometimes help blanking if images are heavy
                overrideItemLayout={(layout, item) => {
                  // Explicitly telling FlashList the size prevents measurement errors
                  layout.size = 60;
                }}
                keyboardShouldPersistTaps="handled"
              />
            )}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 50,
    marginBottom: 10,
    // These properties ensure the header stays fixed
    position: 'relative',
    zIndex: 10,
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    height: '100%',
  },
  listContainer: {
    flex: 1,
    // This ensures the list takes remaining space below the header
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default SearchScreen;