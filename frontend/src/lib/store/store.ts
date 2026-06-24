import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import { authApi } from './features/auth/authApi';
import { propertyApi } from './features/property/propertyApi';
import { leadsApi } from './features/leads/leadsApi';
import { investmentsApi } from './features/investments/investmentsApi';
import { calculationApi } from './features/calculations/calculationApi';
import { planApi } from './features/plan/planApi';
import { subscriptionApi } from './features/subscription/subscriptionApi';
import { alertsApi } from './features/alerts/alertsApi';
import { dashboardApi } from './features/dashboard/dashboardApi';
import { countryApi } from './features/country/countryApi';
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';

// Fallback for Next.js SSR
const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: string) {
      return Promise.resolve();
    },
  };
};

const storage = typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage();

const persistConfig = {
  key: 'auth',
  storage,
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    [authApi.reducerPath]: authApi.reducer,
    [propertyApi.reducerPath]: propertyApi.reducer,
    [leadsApi.reducerPath]: leadsApi.reducer,
    [investmentsApi.reducerPath]: investmentsApi.reducer,
    [calculationApi.reducerPath]: calculationApi.reducer,
    [planApi.reducerPath]: planApi.reducer,
    [subscriptionApi.reducerPath]: subscriptionApi.reducer,
    [alertsApi.reducerPath]: alertsApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [countryApi.reducerPath]: countryApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat([
      authApi.middleware, 
      propertyApi.middleware, 
      leadsApi.middleware, 
      investmentsApi.middleware, 
      calculationApi.middleware,
      planApi.middleware,
      subscriptionApi.middleware,
      alertsApi.middleware,
      dashboardApi.middleware,
      countryApi.middleware
    ]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);
