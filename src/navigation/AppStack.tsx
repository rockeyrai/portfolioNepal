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
import userQuerry from "../services/user"
import { selectPortfolio, setPortfolios } from '../redux/slices/portfolio';
import { getSelectedPortfolio } from '../core/portfolio/portfolioStorage';

const Stack = createNativeStackNavigator<AppStackParamList>();

const AppStack = () => {
  const { colors } = useThemeColors();
  const dispatch = useDispatch<AppDispatch>();
  const { status } = useSelector((state: RootState) => state.auth);
  const [hydrated, setHydrated] = useState(false);
  const { user } = useAuth();

  console.log("current user:",user)
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



  // Show splash until auth & portfolios are ready
  if (status === 'loading' || isPortfolioLoading || !hydrated) {
    return null;
  }

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Analysis" component={AnalysisScreen} />
      <Stack.Screen name="Service" component={ServiceScreen} />
      <Stack.Screen name="Copilot" component={CopilotScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="Company" component={CompanyScreen} />
    </Stack.Navigator>
  );
};

export default AppStack;
