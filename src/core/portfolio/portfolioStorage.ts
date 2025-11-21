import * as Keychain from 'react-native-keychain';
import { SelectedPortfolio } from '../../redux/slices/portfolio';

const SELECTED_PORTFOLIO_KEY = 'selectedPortfolio';

/**
 * Store selected portfolio securely
 */
export async function setSelectedPortfolio(portfolio: SelectedPortfolio) {
  await Keychain.setGenericPassword(
    SELECTED_PORTFOLIO_KEY,
    JSON.stringify(portfolio),
    {
      service: SELECTED_PORTFOLIO_KEY,
    },
  );
}

/**
 * Get selected portfolio from secure storage
 */
export async function getSelectedPortfolio(): Promise<SelectedPortfolio | null> {

  const credentials = await Keychain.getGenericPassword({
    service: SELECTED_PORTFOLIO_KEY,
  });

  if (credentials) {
    try {
      return JSON.parse(credentials.password) as SelectedPortfolio;
    } catch (err) {
      console.warn('Failed to parse portfolio:', err);
      return null;
    }
  }
  return null;
}

/**
 * Remove selected portfolio from secure storage
 */
export async function removeSelectedPortfolio() {
  await Keychain.resetGenericPassword({ service: SELECTED_PORTFOLIO_KEY });
}
