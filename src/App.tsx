// src/App.tsx
import React, { useEffect, useState } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MenuProvider } from 'react-native-popup-menu';
import { store, AppDispatch } from './redux/store';
import { ThemeProvider } from './utils/ColorTheme';
import { hydrateAuthAction } from './redux/slices/authSlice';
import AppNavigator from './navigation';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

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
              <MenuProvider>

            <AppCover />
            </MenuProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </Provider>
    </ThemeProvider>
  );
}
