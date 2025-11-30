import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
  Dimensions,
  LayoutChangeEvent,
  PanResponder,
} from 'react-native';
import { useThemeColors } from '../../../utils/ColorTheme';
import { useAuth } from '../../../core/auth';
import BellButton from '../../ui/BellIcon';
import { useNavigation } from '@react-navigation/native';
import { EditIcon, PlusCircle, SearchIcon, Trash2 } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../../navigation/types';
import { Dropdown } from 'react-native-element-dropdown';
import CustomeDropdown from '../../ui/CustomeDropdown';
import { useDispatch, useSelector } from 'react-redux';
import { selectPortfolioSummary } from '../../../redux/slices/portfolioSummary';
import { getPerformanceMessage } from '../../../utils/getPerformanceMessage';
import { AppDispatch, RootState } from '../../../redux/store';
import { selectPortfolio } from '../../../redux/slices/selecetedportfolio';
import userQuerry from '../../../services/user';
import SelectedAvtar from '../../ui/SelectedAvtar';

type ProfileRoute = NativeStackNavigationProp<AppStackParamList, 'Profile'>;
type SearchRoute = NativeStackNavigationProp<AppStackParamList, 'Search'>;

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAX_PANEL_HEIGHT = SCREEN_HEIGHT * 0.5; // Max height = 50% of screen

export default function ProfileHeader() {
  const { colors } = useThemeColors();
  const { user } = useAuth();

  // const displayName = user?.first_name || 'Guest';
  const displayImage = require('../../../assets/logo/portfolio.png');
  const routeProfile = useNavigation<ProfileRoute>();
  const routeSearch = useNavigation<SearchRoute>();
  const portfolioSummary = useSelector(selectPortfolioSummary);
  const dispatch = useDispatch<AppDispatch>();
  const [msg, setMsg] = useState();

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
  const selectedPortfolio = useSelector(
    (state: RootState) => state.portfolio.selectedPortfolio,
  );

  const { data: userPortfoliosResponse = [] } =
    userQuerry.getUserLinkPortfolio();
  const [modalVisible, setModalVisible] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);

  // 0 = closed, 1 = open
  const animController = useRef(new Animated.Value(0)).current;
  // Extra value for dragging logic
  const panY = useRef(new Animated.Value(0)).current;

  const handleSelectPortfolio = (portfolio: { id: number; name: string }) => {
    console.log('selected portofli:', portfolio);
    dispatch(selectPortfolio(portfolio));
  };

  const openModal = () => {
    // We only set visible here. The animation starts in useEffect
    // AFTER we have measured the content height to ensure smoothness.
    setModalVisible(true);
  };

  const closeModal = () => {
    Animated.timing(animController, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      panY.setValue(0); // Reset drag position
    });
  };

  const handleToggle = () => {
    if (modalVisible) closeModal();
    else openModal();
  };

  // Trigger animation ONLY when modal is visible AND layout is measured
  // This prevents the "instant jump" or visual glitching.
  useEffect(() => {
    if (modalVisible && contentHeight > 0) {
      Animated.spring(animController, {
        toValue: 1,
        useNativeDriver: true,
        bounciness: 5,
        speed: 12,
      }).start();
    }
  }, [modalVisible, contentHeight]);

  // --- Pan Responder (Drag to Dismiss) ---
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          panY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100 || gestureState.vy > 0.5) {
          closeModal();
        } else {
          Animated.spring(panY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  // --- Interpolations ---

  const translateY = Animated.add(
    animController.interpolate({
      inputRange: [0, 1],
      // Start exactly at contentHeight (hidden just below screen)
      // Fallback to SCREEN_HEIGHT only if 0, though opacity handles visibility
      outputRange: [contentHeight || SCREEN_HEIGHT, 0],
    }),
    panY,
  );

  const backdropOpacity = animController.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
  });

  const rotateChevron = animController.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-180deg'],
  });

  // --- Layout Handler ---
  const onLayoutContent = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    const effectiveHeight = Math.min(height, MAX_PANEL_HEIGHT);
    if (Math.abs(contentHeight - effectiveHeight) > 1) {
      setContentHeight(effectiveHeight);
    }
  };

  console.log(`header component rendered ${renderCount.current} times`);
  console.log('summary:', portfolioSummary?.percentage);
  useEffect(() => {
    const message = getPerformanceMessage(portfolioSummary?.percentage);
    setMsg(message);
  }, [selectedPortfolio]);

    const portfolioColor = useSelector(
    (state: RootState) => state.portfolioColor.color,
  );
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Left Section */}
      <View style={styles.leftSection}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleToggle}
          // onPress={() => routeProfile.navigate('Profile')}
          style={styles.profileImageWrapper}
        >
          {/* <Image source={displayImage} style={styles.profileImage} /> */}
          <SelectedAvtar />
        </TouchableOpacity>

        <View style={styles.profileContainer}>
          <Text style={{ color: colors.text, fontWeight: '600', fontSize: 10 }}>
            {msg}
          </Text>
          <Text
            style={{ color: colors.text, fontWeight: 'bold', fontSize: 14 }}
          >
            {selectedPortfolio?.name.toUpperCase()}
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
            placeHolder='--'
            leftIcon={true}
            propBackground={portfolioColor}
            dropDownWith={80}
          />
        </View>
      </View>
      {/* --- Modal --- */}
      <Modal
        transparent
        visible={modalVisible}
        onRequestClose={closeModal}
        animationType="none"
      >
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={closeModal}>
            <Animated.View
              style={[
                styles.backdrop,
                {
                  backgroundColor: colors.secondBackground,
                  opacity: backdropOpacity,
                },
              ]}
            />
          </TouchableWithoutFeedback>

          <Animated.View
            style={[
              styles.bottomPanel,
              {
                // Hides component until height is calculated to prevent "flash"
                opacity: contentHeight > 0 ? 1 : 0,
                transform: [{ translateY }],
                backgroundColor: colors.background,
              },
            ]}
            onLayout={onLayoutContent}
          >
            {/* Drag Handle */}
            <View {...panResponder.panHandlers} style={styles.dragHandleArea}>
              <View
                style={[
                  styles.panelHandle,
                  { backgroundColor: colors.tabActive },
                ]}
              />
            </View>

            {/* Content Container: List + Sticky Footer */}
            <View style={styles.contentWrapper}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.scrollList}
              >
                {userPortfoliosResponse.map(item => (
                  <TouchableOpacity
                    onPress={() => handleSelectPortfolio(item)}
                    key={item.id}
                    style={[
                      styles.portfolioItem,
                      {
                        backgroundColor:
                          selectedPortfolio?.id === item.id
                            ? colors.tabActive
                            : colors.secondBackground,
                      },
                    ]}
                  >
                    <Text
                      style={[styles.portfolioItemText, { color: colors.text }]}
                    >
                      {item.name}
                    </Text>

                    <TouchableOpacity
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 6,
                      }}
                      onPress={() => {
                        console.log('edint');
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: colors.card,
                          borderRadius: 5,
                          padding: 1,
                        }}
                      >
                        <EditIcon color={colors.edit} size={20} />
                      </View>
                      <TouchableOpacity
                        style={{
                          backgroundColor: colors.card,
                          borderRadius: 5,
                          padding: 1,
                        }}
                        onPress={() => {
                          console.log('delteing');
                        }}
                      >
                        <Trash2 color={colors.negative} size={20} />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Sticky Footer */}
              <View style={styles.stickyFooter}>
                <TouchableOpacity
                  style={[styles.addNew, { backgroundColor: colors.button }]}
                >
                  <PlusCircle size={18} color={colors.text} />
                  <Text style={[styles.addNewText, { color: colors.text }]}>
                    Add New Portfolio
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </View>
      </Modal>
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
    borderWidth: 2,
    borderColor: '#d6c90bff',
    borderRadius: 25,
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

  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  bottomPanel: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 8,
    paddingBottom: 30, // Safe area padding
    // paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
    overflow: 'hidden',
  },
  dragHandleArea: {
    width: '100%',
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  panelHandle: {
    width: 40,
    height: 5,
    borderRadius: 25,
  },

  // New Layout for Sticky Footer
  contentWrapper: {
    maxHeight: MAX_PANEL_HEIGHT - 50, // Handle size + Padding
  },
  scrollList: {
    flexGrow: 0, // Allows shrinking if list is small
    marginBottom: 4,
  },

  portfolioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    // borderBottomWidth: 1,
    paddingHorizontal: 20,
  },
  portfolioItemText: {
    fontSize: 16,
    fontWeight: '500',
  },

  // Sticky Footer
  stickyFooter: {
    // borderTopWidth: 1,
  },
  addNew: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    justifyContent: 'center',
    margin: 'auto',
    borderRadius: 25,
  },
  addNewText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
});
