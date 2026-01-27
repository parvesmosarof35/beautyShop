'use client';
import '../../app/globals.css';
import { useState, useEffect } from 'react';
import { Inter } from 'next/font/google';
import { useAuthState } from '@/app/store/hooks';
import Header from '@/app/components/dashboard/Header';
import Sidebar from '@/app/components/dashboard/Sidebar';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { Providers } from '@/app/providers';

const inter = Inter({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
});

function AdminAuthorizedLayout({ children }: { children: React.ReactNode }) {
  const { token } = useAuthState();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      // Check authentication
      const storedToken = localStorage.getItem('token') || token;

      if (!storedToken) {
        router.push('/login');
        return;
      }

      try {
        const decoded: any = jwtDecode(storedToken);
        if (decoded.role === 'admin' || decoded.role === 'superAdmin') {
          setIsAuthorized(true);
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error("Invalid token:", error);
        router.push('/login');
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [token, router]);

  if (isChecking || !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4A574] mb-4"></div>
          <p className="text-neutral-400">Verifying access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col">
      <Header isSidebarOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <div
          className={`
                bg-neutral-900 
                h-[calc(100vh-64px)] 
                overflow-y-auto 
                transition-transform duration-300 ease-in-out 
                fixed md:static top-[64px] left-0 z-50 
                w-[280px] sm:w-[300px] border-r border-neutral-800
                shadow-xl md:shadow-none
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
                md:translate-x-0
            `}
        >
          <Sidebar
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={() => setIsSidebarOpen(false)}
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 w-full bg-neutral-950 overflow-y-auto h-[calc(100vh-64px)] p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} style={
      { '--font-primary': `var(--font-inter)` } as React.CSSProperties
    }>
      <body className="font-inter bg-neutral-950 text-neutral-200" suppressHydrationWarning={true}>
        <Providers>
          <AdminAuthorizedLayout>
            {children}
          </AdminAuthorizedLayout>
        </Providers>
      </body>
    </html>
  );
}
