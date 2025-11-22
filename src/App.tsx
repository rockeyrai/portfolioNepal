// src/App.tsx
import React, { useEffect, useState } from 'react';
import AppNavigator from './navigation';
import { ThemeProvider } from './utils/ColorTheme';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState, store } from './redux/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { hydrateAuthAction } from './redux/slices/authSlice';
import userQuerry from './services/user/index';
import { selectPortfolio, setPortfolios } from './redux/slices/portfolio';
import { getSelectedPortfolio } from './core/portfolio/portfolioStorage';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const queryClient = new QueryClient();

function AppInitializer() {
  const dispatch = useDispatch<AppDispatch>();
  const { status } = useSelector((state: RootState) => state.auth);
  const [hydrated, setHydrated] = useState(false);

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

  // Hydrate auth
  useEffect(() => {
    dispatch(hydrateAuthAction());
  }, [dispatch]);

  // Show splash until auth & portfolios are ready
  if (status === 'loading' || isPortfolioLoading || !hydrated) {
    return null;
  }

  return <AppNavigator />;
}

export default function App() {
  return (
    <ThemeProvider>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <AppInitializer />
          </GestureHandlerRootView>
        </QueryClientProvider>
      </Provider>
    </ThemeProvider>
  );
}
