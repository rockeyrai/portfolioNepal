import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/Home';
import ProfileScreen from '../screens/Profile';
import { AppStackParamList } from './types';
import AnalysisScreen from '../screens/Analysis';
import ServiceScreen from '../screens/Service';
import CopilotScreen from '../screens/Copilot';
import { useThemeColors } from '../utils/ColorTheme';
import SearchScreen from '../screens/Search';
import CompanyScreen from '../screens/Company/[symbol]';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { useAuth } from '../core/auth';
import userQuerry from '../services/user';
import {
  selectPortfolio,
  setPortfolios,
} from '../redux/slices/selecetedportfolio';
import { getSelectedPortfolio } from '../core/portfolio/portfolioStorage';
import { setPortfolioDetails } from '../redux/slices/userPortfolios';
import BottomNavLayout from '../layouts/BottomNav';
import BottomNav from '../components/BottomNav';

const Stack = createNativeStackNavigator<AppStackParamList>();

const AppStack = () => {
  const { colors } = useThemeColors();
  const dispatch = useDispatch<AppDispatch>();
  const { status } = useSelector((state: RootState) => state.auth);
  const [hydrated, setHydrated] = useState(false);
  const { user } = useAuth();

  console.log('current user:', user);
  const { data: userPortfoliosResponse, isLoading: isPortfolioLoading } =
    userQuerry.getUserLinkPortfolio();

  const portfolios = Array.isArray(userPortfoliosResponse)
    ? userPortfoliosResponse
    : userPortfoliosResponse?.data ?? [];

  useEffect(() => {
    const initPortfolios = async () => {
      if (isPortfolioLoading || !userPortfoliosResponse) {
        return;
      }

      const list = portfolios.map(p => ({ id: p.id, name: p.name }));

      // 1. Update Redux
      dispatch(setPortfolios(list));

      // 2. Hydrate storage
      const stored = await getSelectedPortfolio();

      if (stored && list.find(p => p.id === stored.id)) {
        dispatch(selectPortfolio(stored));
      } else if (list.length > 0) {
        dispatch(selectPortfolio(list[0]));
      } else {
        dispatch(selectPortfolio(null));
      }

      setHydrated(true);
    };

    initPortfolios();
  }, [isPortfolioLoading, userPortfoliosResponse]);

  const selectedPortfolio = useSelector(
    (state: RootState) => state.portfolio.selectedPortfolio,
  );
  console.log('selsected portfolio:', selectPortfolio);
  const portfolioId = selectedPortfolio?.id ?? 0;

  const { data: userPortfoliodetails, isLoading } =
    userQuerry.getPortfolioDetails(portfolioId);

  console.log('portfolio details', userPortfoliodetails);
  useEffect(() => {
    if (userPortfoliodetails && userPortfoliodetails?.dataList?.length > 0) {
      dispatch(setPortfolioDetails(userPortfoliodetails?.dataList));
    }
  }, [userPortfoliodetails, dispatch]);

  // Show splash until auth & portfolios are ready
  if (status === 'loading' || isPortfolioLoading || !hydrated) {
    return null;
  }

  function ScreenLayout({ children }) {
  return (
    <>
      {children}
      <BottomNav />
    </>
  );
}


return (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen
      name="Home"
      component={() => (
        <ScreenLayout>
          <HomeScreen />
        </ScreenLayout>
      )}
    />

    <Stack.Screen
      name="Profile"
      component={() => (
        <ScreenLayout>
          <ProfileScreen />
        </ScreenLayout>
      )}
    />

    <Stack.Screen
      name="Analysis"
      component={() => (
        <ScreenLayout>
          <AnalysisScreen />
        </ScreenLayout>
      )}
    />

    <Stack.Screen
      name="Service"
      component={() => (
        <ScreenLayout>
          <ServiceScreen />
        </ScreenLayout>
      )}
    />

    <Stack.Screen
      name="Copilot"
      component={() => (
        <ScreenLayout>
          <CopilotScreen />
        </ScreenLayout>
      )}
    />

    <Stack.Screen name="Search" component={SearchScreen} />
    <Stack.Screen name="Company" component={CompanyScreen} />
  </Stack.Navigator>
);


};

export default AppStack;
