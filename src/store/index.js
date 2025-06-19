import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import settingReducer from './setting/reducers';
import authSlice from './slices/authSlice';

// Combine your reducers
const rootReducer = combineReducers({
  setting: settingReducer,
  auth: authSlice,
});

// Configure persist settings
const persistConfig = {
  key: 'root',
  storage,
};

// Create the persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV === 'development',
});

// Persist the store
export const persistor = persistStore(store);




