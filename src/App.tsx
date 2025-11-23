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
import { useAuth } from './core/auth';
import { ContinousBaseGesture } from 'react-native-gesture-handler/lib/typescript/handlers/gestures/gesture';
import { useRoute } from '@react-navigation/native';

const queryClient = new QueryClient();

const AppCover = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Hydrate auth
  useEffect(() => {
    dispatch(hydrateAuthAction());
  }, [dispatch]);
  return <AppNavigator />;
};

export default function App() {
  return (
    <ThemeProvider>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <AppCover />
          </GestureHandlerRootView>
        </QueryClientProvider>
      </Provider>
    </ThemeProvider>
  );
}
