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
  ArrowUpIcon,
  ArrowDownIcon,
  ChevronDownIcon,
  PlusCircle,
  EditIcon,
  Trash2,
} from 'lucide-react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store'; // Adjust path if needed
import userQuerry from '../../../services/user'; // Adjust path if needed

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAX_PANEL_HEIGHT = SCREEN_HEIGHT * 0.5; // Max height = 50% of screen

const SummaryDisplay = () => {
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

  // --- State & Animation Refs ---
  const [modalVisible, setModalVisible] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);

  // 0 = closed, 1 = open
  const animController = useRef(new Animated.Value(0)).current;
  // Extra value for dragging logic
  const panY = useRef(new Animated.Value(0)).current;

  // --- Actions ---

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
    outputRange: ['0deg', '180deg'],
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
    <View style={styles.card}>
      {/* --- Header Content --- */}
      <View>
        <Text style={styles.totalValue}>
          Rs. {totalPortfolio?.totalportfoliovalue?.toFixed(2) ?? '--'}
        </Text>

        <View style={styles.detailsContainer}>
          <View style={styles.percentageContainer}>
            {totalPortfolio?.percentage !== undefined &&
            totalPortfolio.percentage < 0 ? (
              <ArrowDownIcon size={15} color="#ef4444" />
            ) : (
              <ArrowUpIcon size={15} color="#22c55e" />
            )}
            <Text
              style={[
                styles.percentageText,
                {
                  color: totalPortfolio?.percentage < 0 ? '#ef4444' : '#22c55e',
                },
              ]}
            >
              {totalPortfolio?.percentage?.toFixed(2) ?? '--'}%
            </Text>
          </View>
          <Text style={styles.totalText}>
            {totalPortfolio?.total?.toFixed(2) ?? '--'}
          </Text>
        </View>
      </View>

      {/* --- Trigger Button --- */}
      <TouchableOpacity
        style={styles.dropdown}
        activeOpacity={0.8}
        onPress={handleToggle}
      >
        <Text style={styles.dropdownText}>{selectedPortfolio?.name}</Text>
        <Animated.View style={{ transform: [{ rotate: rotateChevron }] }}>
          <ChevronDownIcon size={16} color="white" />
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
              style={[styles.backdrop, { opacity: backdropOpacity }]}
            />
          </TouchableWithoutFeedback>

          <Animated.View
            style={[
              styles.bottomPanel,
              {
                // Hides component until height is calculated to prevent "flash"
                opacity: contentHeight > 0 ? 1 : 0,
                transform: [{ translateY }],
              },
            ]}
            onLayout={onLayoutContent}
          >
            {/* Drag Handle */}
            <View {...panResponder.panHandlers} style={styles.dragHandleArea}>
              <View style={styles.panelHandle} />
            </View>

            {/* Content Container: List + Sticky Footer */}
            <View style={styles.contentWrapper}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.scrollList}
              >
                {userPortfoliosResponse.map(item => (
                  <TouchableOpacity key={item.id} style={styles.portfolioItem}>
                    <Text style={styles.portfolioItemText}>{item.name}</Text>
                    {item.id === selectedPortfolio.id && (
                      <View style={styles.activeDot} />
                    )}
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <EditIcon size={20} />
                      <Trash2 size={20} />
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Sticky Footer */}
              <View style={styles.stickyFooter}>
                <TouchableOpacity style={styles.addNew}>
                  <PlusCircle size={18} color="#666" />
                  <Text style={styles.addNewText}>Add New Portfolio</Text>
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
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
    color: '#1f2937',
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
    backgroundColor: '#f3f4f6',
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
    color: '#6b7280',
  },
  dropdown: {
    marginTop: 16,
    backgroundColor: '#dc2626',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    elevation: 2,
  },
  dropdownText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  bottomPanel: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 8,
    paddingBottom: 30, // Safe area padding
    paddingHorizontal: 20,
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
    backgroundColor: '#e5e7eb',
    borderRadius: 10,
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
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  portfolioItemText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#dc2626',
  },

  // Sticky Footer
  stickyFooter: {
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    backgroundColor: '#fff',
  },
  addNew: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 4,
  },
  addNewText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 15,
    fontWeight: '500',
  },
});
