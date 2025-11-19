// src/App.tsx
import React, { useEffect } from 'react';
import AppNavigator from './navigation';
import { ThemeProvider } from './utils/ColorTheme';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState, store } from './redux/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { hydrateAuthAction } from './redux/slices/authSlice';

const queryClient = new QueryClient();

function AppInitializer() {
  const dispatch = useDispatch<AppDispatch>();
  const { status } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(hydrateAuthAction());
  }, []);

  if (status === 'loading') {
    return null; // splash or blank until auth loads
  }

  return <AppNavigator />;
}

export default function App() {
  return (
    <ThemeProvider>       
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <AppInitializer />
        </QueryClientProvider>
      </Provider>
    </ThemeProvider>
  );
}
