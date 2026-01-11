import { Cormorant_Garamond } from 'next/font/google';
import { Metadata, Viewport } from 'next';
import '../../app/globals.css';
import { Providers } from '../providers';
import Header from '../components/Header';
import Footer from '../components/Footer';

const cormorant = Cormorant_Garamond({ 
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'LUNEL Beauty',
  description: 'Discover our natural beauty products',
  icons: {
    icon: [
      {
        url: '/images/favicon.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/images/favicon.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/images/favicon.png',
        type: 'image/svg+xml',
      },
    ],
    apple: '/images/favicon.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0a0a',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cormorant.variable}>
      <body className="font-sans bg-[#0a0a0a] text-white" suppressHydrationWarning={true}>
        <div className="min-h-screen">
          <Providers>
            <Header />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
          </Providers>
        </div>
      </body>
    </html>
  );
}