'use client';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor, RootState } from './store';
import { useGetMeQuery } from './features/auth/authApi';
import { useSelector } from 'react-redux';

function AuthLoader({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  
  // Automatically fetch user data if authenticated in local storage but needs fresh server data
  // The query only runs if isAuthenticated is true
  useGetMeQuery(undefined, { skip: !isAuthenticated });

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthLoader>
          {children}
        </AuthLoader>
      </PersistGate>
    </Provider>
  );
}
