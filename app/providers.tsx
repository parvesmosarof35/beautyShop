'use client';

import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import { WishlistProvider } from './context/WishlistContext';
import { CartProvider } from './context/CartContext';
import { useEffect, useState } from 'react';
import { useRecordSiteVisitMutation } from './store/api/analyticsApi';
import { usePathname } from 'next/navigation';
import Popup from './components/Popup';

function AnalyticsTracker({ children }: { children: ReactNode }) {
  const [recordSiteVisit] = useRecordSiteVisitMutation();
  const pathname = usePathname();
  const [hasTracked, setHasTracked] = useState(false);

  useEffect(() => {
    if (hasTracked) return;

    const today = new Date().toISOString().split('T')[0];
    const lastVisitDate = localStorage.getItem('last_site_visit_date_v2');
    const isUnique = lastVisitDate !== today;

    // Record the visit
    recordSiteVisit({ isUnique }).catch(() => {});
    
    // Update local storage
    localStorage.setItem('last_site_visit_date_v2', today);
    setHasTracked(true);
  }, [pathname, hasTracked, recordSiteVisit]);

  return <>{children}</>;
}


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
          <AnalyticsTracker>
            <WishlistProvider>
              <CartProvider>
                <Popup />
                {children}
              </CartProvider>
            </WishlistProvider>
          </AnalyticsTracker>
        </AuthProvider>
      </PersistGate>
    </Provider>
  );
}
