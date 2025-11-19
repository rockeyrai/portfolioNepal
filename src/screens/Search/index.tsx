import React, { useState, useMemo } from 'react';
import {
  View,
  TextInput,
  Text,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '../../utils/ColorTheme';
import { getActiveCompanyNames } from '../Service/company';
import { FlashList } from '@shopify/flash-list';
import BottomNavLayout from '../../layouts/BottomNav';
import Config from 'react-native-config';
import { Search } from 'lucide-react-native';
import CompanyRow from './components/CompanyList';

const SearchScreen = () => {
  const { colors } = useThemeColors();
  const { data: companies = [], isLoading } = getActiveCompanyNames();

  const [search, setSearch] = useState('');

  const logoBaseURL = Config.COMPANY_LOGO_URL;

  const filtered = useMemo(() => {
    if (!search.trim()) return companies;

    const query = search.toLowerCase();
    return companies.filter(item => {
      const name = item?.companyName?.toLowerCase?.() ?? '';
      const symbol = item?.symbol?.toLowerCase?.() ?? '';
      const sector = item?.sectorName?.toLowerCase?.() ?? '';

      return (
        name.includes(query) || symbol.includes(query) || sector.includes(query)
      );
    });
  }, [search, companies]);

  return (
    <BottomNavLayout>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: colors.background,
          paddingHorizontal: 12,
          paddingTop: 10,
        }}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {/* Search Input */}
          <View
            style={{
              position: 'relative',
              marginBottom: 12,
            }}
          >
            <Search
              size={20}
              color={colors.text}
              style={{
                position: 'absolute',
                left: 14,
                top: 12,
              }}
            />

            <TextInput
              placeholder="Search company, symbol or sector..."
              placeholderTextColor={colors.text + '80'}
              style={{
                backgroundColor: colors.secondBackground,
                color: colors.text,
                borderRadius: 12,
                paddingVertical: 10,
                paddingLeft: 40,
                paddingRight: 14,
                fontSize: 16,
              }}
              value={search}
              onChangeText={setSearch}
            />
          </View>

          {/* Company List */}
          <FlashList
            data={filtered}
            estimatedItemSize={60}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              !isLoading && (
                <View style={{ paddingTop: 30 }}>
                  <Text style={{ color: colors.text, textAlign: 'center' }}>
                    No companies found
                  </Text>
                </View>
              )
            }
            renderItem={({ item }) => {
              return (
                <CompanyRow
                  item={item}
                  colors={colors}
                  logoBaseURL={logoBaseURL}
                />
              );
            }}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </BottomNavLayout>
  );
};

export default SearchScreen;
