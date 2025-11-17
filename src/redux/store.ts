import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './Reducers';

export const store = configureStore({
  reducer: rootReducer,
});


// TypeScript types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;