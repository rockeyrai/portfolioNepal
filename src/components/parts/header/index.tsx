import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useThemeColors } from '../../../utils/ColorTheme';
import { useAuth } from '../../../core/auth';
import BellButton from '../../ui/BellIcon';
import { useNavigation } from '@react-navigation/native';
import { SearchIcon } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../../navigation/types';
import { Dropdown } from 'react-native-element-dropdown';
import CustomeDropdown from '../../ui/CustomeDropdown';

type ProfileRoute = NativeStackNavigationProp<AppStackParamList, 'Profile'>;
type SearchRoute = NativeStackNavigationProp<AppStackParamList, 'Search'>;

export default function ProfileHeader() {
  const { colors } = useThemeColors();
  const { user } = useAuth();

  const displayName = user?.first_name || 'Guest';
  const displayImage = require('../../../assets/logo/portfolio.png');
  const routeProfile = useNavigation<ProfileRoute>();
  const routeSearch = useNavigation<SearchRoute>();

  const filterOptions = [
    { label: 'Today', value: 'Today' },
    { label: 'Weeak', value: 'Weeak' },
    { label: 'Month', value: 'Month' },
  ];
  const [selectedFilter, setSelectedFilter] = useState<
    'Today' | 'Weeak' | 'Month'
  >('Today');
  const renderCount = useRef(0);
  useEffect(() => {
    console.log('header component mounted');
    return () => console.log('header component unmounted');
  }, []);
  renderCount.current += 1;

  console.log(`header component rendered ${renderCount.current} times`);
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Left Section */}
      <View style={styles.leftSection}>
        <TouchableOpacity
          onPress={() => routeProfile.navigate('Profile')}
          style={styles.profileImageWrapper}
        >
          <Image source={displayImage} style={styles.profileImage} />
        </TouchableOpacity>

        <View style={styles.profileContainer}>
          <Text style={{ color: colors.text, fontWeight: '600', fontSize: 10 }}>
            Good Morning
          </Text>
          <Text
            style={{ color: colors.text, fontWeight: 'bold', fontSize: 14 }}
          >
            {displayName.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Right Section */}
      <View style={styles.rightSection}>
        <TouchableOpacity
          style={[
            styles.searchicon,
            { backgroundColor: colors.secondBackground },
          ]}
          onPress={() => routeSearch.navigate('Search')}
          activeOpacity={0.7}
        >
          <SearchIcon strokeWidth={1} size={18} color={colors.text} />
        </TouchableOpacity>

        <BellButton count={0} />
        <View style={{ width: 80 }}>
          <CustomeDropdown
            filterOptions={filterOptions}
            selectedFilter={selectedFilter}
            setselectedFilter={setSelectedFilter}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  profileContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  profileImageWrapper: {
    width: 45,
    height: 45,
    borderWidth: 4,
    borderColor: '#cdf14bff',
    borderRadius: 40,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
  },
  searchicon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 35,
    height: 35,
    borderRadius: 25,
  },
});
