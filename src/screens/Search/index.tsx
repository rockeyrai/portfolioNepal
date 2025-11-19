import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  TextInput,
  Text,
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { ArrowLeft } from 'lucide-react-native';
import Config from 'react-native-config';
import { useThemeColors } from '../../utils/ColorTheme';
import { getActiveCompanyNames } from '../Service/company';
import { getSearchHistory } from '../../utils/searchHistory';
import BottomNavLayout from '../../layouts/BottomNav';
import CompanyRow from './components/CompanyList';
import CompanySkeletonRow from './components/CompanySkeleton';

type Company = {
  symbol: string;
  companyName?: string;
  sectorName?: string;
};

const SearchScreen = () => {
  const { colors } = useThemeColors();
  const { data: companies = [], isLoading } = getActiveCompanyNames();

  const [search, setSearch] = useState('');
  const [searchHistory, setSearchHistory] = useState<Record<string, number>>({});

  const logoBaseURL = Config.COMPANY_LOGO_URL;

  // Load search history once on mount
  useEffect(() => {
    const loadHistory = async () => {
      const history = await getSearchHistory();
      setSearchHistory(history);
    };
    loadHistory();
  }, []);

  // Memoized filtering and sorting logic
  const finalList = useMemo(() => {
    if (!companies.length) return [];

    const query = search.trim().toLowerCase();

    // 1️⃣ FILTER
    const filteredList = !query
      ? companies
      : companies.filter(item => {
          const name = item.companyName?.toLowerCase() ?? '';
          const symbol = item.symbol?.toLowerCase() ?? '';
          const sector = item.sectorName?.toLowerCase() ?? '';
          return (
            name.includes(query) ||
            symbol.includes(query) ||
            sector.includes(query)
          );
        });

    // 2️⃣ SORT BY SEARCH COUNTS
    const sorted = [...filteredList].sort((a, b) => {
      const aCount = searchHistory[a.symbol] || 0;
      const bCount = searchHistory[b.symbol] || 0;
      return bCount - aCount;
    });

    // 3️⃣ TOP 3 PRIORITIZATION ONLY WHEN SEARCH IS EMPTY
    if (!query) {
      const top = sorted.slice(0, 3);
      const rest = sorted.slice(3);
      return [...top, ...rest];
    }

    return sorted;
  }, [search, companies, searchHistory]);

  // Memoized renderItem
  const renderItem = useCallback(
    ({ item }: { item: Company }) => (
      <CompanyRow item={item} logoBaseURL={logoBaseURL} />
    ),
    [logoBaseURL]
  );

  // Memoized keyExtractor
  const keyExtractor = useCallback((item: Company) => item.symbol, []);

  // Memoized ListEmptyComponent
  const listEmptyComponent = useMemo(() => {
    if (search.length > 0) {
      return (
        <Text style={[styles.emptyText, { color: colors.text }]}>
          No companies found
        </Text>
      );
    }
    return null;
  }, [search.length, colors.text]);

  return (
    <BottomNavLayout>
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: colors.background }]}
      >
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {/* Search Input */}
          <View style={styles.searchContainer}>
            <View style={styles.iconContainer}>
              <ArrowLeft color={colors.text} />
            </View>

            <TextInput
              placeholder="Search company"
              placeholderTextColor={colors.text + '80'}
              style={[
                styles.searchInput,
                { color: colors.text }
              ]}
              value={search}
              onChangeText={setSearch}
            />
          </View>

          {/* Company List */}
          {isLoading ? (
            <FlashList
              data={Array.from({ length: 12 })}
              keyExtractor={(_, index) => index.toString()}
              renderItem={() => <CompanySkeletonRow />}
              estimatedItemSize={60}
            />
          ) : companies.length === 0 ? (
            <Text style={[styles.loadingText, { color: colors.text }]}>
              Loading companies...
            </Text>
          ) : (
            <FlashList<Company>
              data={finalList}
              estimatedItemSize={60}
              keyExtractor={keyExtractor}
              renderItem={renderItem}
              ListEmptyComponent={listEmptyComponent}
            />
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </BottomNavLayout>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  keyboardView: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  iconContainer: {
    width: '10%',
  },
  searchInput: {
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 6,
    fontSize: 16,
    width: '85%',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
  },
});

export default SearchScreen;