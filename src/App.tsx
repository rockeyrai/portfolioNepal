/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

// On device: Portfolio Nepal
// Internal App Registry name: PortfolioNepal
// Bundle/package name: com.portfolionepal.app

// src/App.tsx
import React from 'react';
import AppNavigator from './navigation';
import { ThemeProvider } from './utils/ColorTheme';
import { Provider } from 'react-redux';
import { store } from './redux/store';

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AppNavigator />
      </ThemeProvider>
    </Provider>
  );
};

export default App;
