'use client';

import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import { WishlistProvider } from './context/WishlistContext';
import { CartProvider } from './context/CartContext';


function AuthProvider({ children }: { children: ReactNode }) {
  // Manual hydration logic removed in favor of redux-persist
  return <>{children}</>;
}

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </PersistGate>
    </Provider>
  );
}
