import React, { useState, useRef, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  PanResponder,
  ScrollView,
  TouchableWithoutFeedback,
  LayoutChangeEvent,
} from 'react-native';
import {
  ChevronDownIcon,
  PlusCircle,
  EditIcon,
  Trash2,
} from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store'; // Adjust path if needed
import userQuerry from '../../../services/user'; // Adjust path if needed
import { useThemeColors } from '../../../utils/ColorTheme';
import SortUpSvg from '../../../assets/svg/sortup';
import SortDownSvg from '../../../assets/svg/sortdown';
import { selectPortfolio } from '../../../redux/slices/selecetedportfolio';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAX_PANEL_HEIGHT = SCREEN_HEIGHT * 0.5; // Max height = 50% of screen

const SummaryDisplay = () => {


    const renderCount = useRef(0);
    useEffect(() => {
      console.log('Summaryu DAta mounted');
      return () => console.log('Summaryu DAta unmounted');
    }, []);
    renderCount.current += 1;
  
    console.log(`Summaryu DAta rendered ${renderCount.current} times`);

  // --- Data Fetching ---
  const selectedPortfolio = useSelector(
    (state: RootState) => state.portfolio.selectedPortfolio,
  );
  const portfolioId = selectedPortfolio?.id ?? 0;
  if (!portfolioId) return null; //make a component to show  user did not have id
  const { data: totalPortfolio = {} } =
    userQuerry.getUserTotalPortfolio(portfolioId);
  const { data: userPortfoliosResponse = [] } =
    userQuerry.getUserLinkPortfolio();
  const { colors } = useThemeColors();
  const dispatch = useDispatch<AppDispatch>();
  // --- State & Animation Refs ---
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

  if (!selectedPortfolio) return <Text>No Portfolio to Show</Text>;

  return (
    <View style={[styles.card, { backgroundColor: colors.background }]}>
      {/* --- Header Content --- */}
      <View>
        <Text style={[styles.totalValue, { color: colors.text }]}>
          Rs. {totalPortfolio?.totalPortfolioValue?.toFixed(2) ?? '--'}
        </Text>

        <View style={styles.detailsContainer}>
          <View style={styles.percentageContainer}>
            {/* {totalPortfolio?.percentage !== undefined &&
              totalPortfolio.percentage !== 0 &&
              (totalPortfolio.percentage < 0 ? (
                <SortDownSvg height={15} width={15} color={colors.negative} />
              ) : (
                <SortUpSvg height={15} width={15} color={colors.positive} />
              ))} */}

            <Text
              style={[
                styles.percentageText,
                {
                  color:
                    totalPortfolio?.percentage === 0 &&
                    totalPortfolio?.percentage === null &&
                    totalPortfolio?.percentage === undefined
                      ? colors.secondaryText
                      : totalPortfolio?.percentage < 0
                      ? colors.negative
                      : colors.positive,
                },
              ]}
            >
              {totalPortfolio?.percentage?.toFixed(2) ?? '--'}%
            </Text>
          </View>
          <Text style={[styles.totalText,{color:colors.text}]}>
            Rs.{totalPortfolio?.total?.toFixed(2) ?? '--'}
          </Text>
        </View>
      </View>

      {/* --- Trigger Button --- */}
      <TouchableOpacity
        style={[styles.dropdown, { backgroundColor: colors.secondBackground }]}
        activeOpacity={0.8}
        onPress={handleToggle}
      >
        <Text style={[styles.dropdownText, { color: colors.text }]}>
          {selectedPortfolio?.name}
        </Text>
        <Animated.View style={{ transform: [{ rotate: rotateChevron }] }}>
          <ChevronDownIcon size={16} color={colors.text} />
        </Animated.View>
      </TouchableOpacity>

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

                    <View
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
                      <View
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
                      </View>
                    </View>
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
};

export default SummaryDisplay;

const styles = StyleSheet.create({
  // ... existing styles ...
  card: {
    padding: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 1,
    textAlign: 'center',
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    alignItems: 'center',
  },
  percentageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  percentageText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
  },
  totalText: {
    fontSize: 14,
    fontWeight: '500',
  },
  dropdown: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,

    // elevation: 2,
  },
  dropdownText: {
    fontWeight: '600',
    fontSize: 14,
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
