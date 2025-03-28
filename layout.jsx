import './styles/globals.css';
import { ReactQueryProvider } from './lib/react-query-provider';
import { PWAInitializer } from './lib/pwa-initializer';
import { AuthProvider } from './lib/auth-provider';

export const metadata = {
  title: 'ExpertChat System',
  description: 'A platform connecting clients with experts in various fields',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.svg',
    apple: '/icons/icon-192x192.png',
  },
  themeColor: '#6541EA',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body>
        <AuthProvider>
          <ReactQueryProvider>
            <PWAInitializer />
            {children}
          </ReactQueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
