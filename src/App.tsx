// src/App.tsx
import React, { useEffect, useState } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { store, AppDispatch } from './redux/store';
import { ThemeProvider } from './utils/ColorTheme';
import { hydrateAuthAction } from './redux/slices/authSlice';
import AppNavigator from './navigation';

const queryClient = new QueryClient();

const AppCover = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const hydrate = async () => {
      await dispatch(hydrateAuthAction());
      setHydrated(true);
    };
    hydrate();
  }, [dispatch]);

  if (!hydrated) return null; // or a splash/loading screen

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
