import React, { useEffect, useRef, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppStackParamList } from './types';
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
import BottomTabs from './appStack/BottomTabs';
import api from '../services';

const Stack = createNativeStackNavigator<AppStackParamList>();

const AppStack = () => {
  const renderCount = useRef(0);
  useEffect(() => {
    console.log('AppStack mounted');
    return () => console.log('AppStack unmounted');
  }, []);
  renderCount.current += 1;

  console.log(`AppStack rendered ${renderCount.current} times`);

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

      dispatch(setPortfolios(list));

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

  useEffect(() => {
    const fetchstockDAta = async () => {
      const { data } =
        await api.get(`/adv-portfolio/portfolio/stocks/${portfolioId}?performanceType=&timePeriod=
`);
      console.log('use effect data', data?.data?.dataList);
      dispatch(setPortfolioDetails(data?.data?.dataList));
    };

    fetchstockDAta();
  }, [portfolioId]);

  // Show splash until auth & portfolios are ready
  if (status === 'loading' || isPortfolioLoading || !hydrated) {
    return null;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="MainTabs"
        component={BottomTabs}
        options={{ animation: 'slide_from_right' }}
      />

      {/* screens WITHOUT bottom nav */}
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="Company" component={CompanyScreen} />
    </Stack.Navigator>
  );
};

export default AppStack;
