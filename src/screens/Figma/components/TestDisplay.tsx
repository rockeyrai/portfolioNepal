import React, { useState, useRef, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';

import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store'; // Adjust path if needed
import userQuerry from '../../../services/user'; // Adjust path if needed
import { useThemeColors } from '../../../utils/ColorTheme';
import { TrendingUp } from 'lucide-react-native';

const TestDisplay = () => {
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

  const { colors } = useThemeColors();

  if (!selectedPortfolio) return <Text>No Portfolio to Show</Text>;
  const formatNumber = (value?: number) => {
    if (value == null || isNaN(value)) return '--';
    return value.toLocaleString('en-IN', { minimumFractionDigits: 2 });
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.background }]}>
      {/* --- Header Content --- */}
      <View>
        <View
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ color: colors.secondaryText }}>Portfolio Value</Text>
          <Text style={[styles.totalValue, { color: colors.text }]}>
            Rs {formatNumber(totalPortfolio?.totalPortfolioValue)}
          </Text>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.percentageContainer}>
            <Text
              style={[
                styles.percentageText,
                {
                  color: colors.secondaryText,
                },
              ]}
            >
              Profit/Loss :
            </Text>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 6,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <TrendingUp
              color={
                totalPortfolio?.percentage === 0 &&
                totalPortfolio?.percentage === null &&
                totalPortfolio?.percentage === undefined
                  ? colors.secondaryText
                  : totalPortfolio?.percentage < 0
                  ? colors.negative
                  : colors.positive
              }
              size={10}
            />
            <Text
              style={[
                styles.totalText,
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
              Rs.
              {totalPortfolio?.total?.toFixed(2) ?? '--'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default TestDisplay;

const styles = StyleSheet.create({
  // ... existing styles ...
  card: {
    padding: 16,
    // borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 1,
    textAlign: 'center',
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    alignItems: 'center',
  },
  percentageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  percentageText: {
    // marginLeft: 4,
    fontSize: 12,
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
