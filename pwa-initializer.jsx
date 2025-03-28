'use client';

import { useEffect, useState } from 'react';
import { Workbox } from 'workbox-window';

export function PWAInitializer() {
  const [isOnline, setIsOnline] = useState(true);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);

  useEffect(() => {
    // Handle online/offline status
    const handleOnlineStatusChange = () => {
      setIsOnline(navigator.onLine);
      if (navigator.onLine) {
        // When coming back online, check for updates
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
        }
      }
    };

    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);
    setIsOnline(navigator.onLine);

    // Register service worker
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      process.env.NODE_ENV === 'production'
    ) {
      const wb = new Workbox('/service-worker.js');

      wb.addEventListener('installed', (event) => {
        if (event.isUpdate) {
          setIsUpdateAvailable(true);
        } else {
          setOfflineReady(true);
        }
        console.log('Service Worker installed');
      });

      wb.addEventListener('controlling', (event) => {
        console.log('Service Worker controlling');
      });

      wb.addEventListener('activated', (event) => {
        console.log('Service Worker activated');

        // If there's an update, reload the page to use the new version
        if (event.isUpdate) {
          window.location.reload();
        }
      });

      wb.register();
    }

    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, []);

  return (
    <>
      {!isOnline && (
        <div className="offline-notification">
          You are currently offline. Some features may be unavailable.
          <style jsx>{`
            .offline-notification {
              position: fixed;
              bottom: 16px;
              left: 16px;
              right: 16px;
              background-color: #ff9800;
              color: white;
              padding: 12px 16px;
              border-radius: 4px;
              z-index: 1000;
              text-align: center;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            }
          `}</style>
        </div>
      )}

      {isUpdateAvailable && (
        <div className="update-notification">
          A new version is available. Refreshing...
          <style jsx>{`
            .update-notification {
              position: fixed;
              top: 16px;
              left: 16px;
              right: 16px;
              background-color: #4caf50;
              color: white;
              padding: 12px 16px;
              border-radius: 4px;
              z-index: 1000;
              text-align: center;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            }
          `}</style>
        </div>
      )}

      {offlineReady && (
        <div className="offline-ready-notification">
          App is ready for offline use
          <style jsx>{`
            .offline-ready-notification {
              position: fixed;
              top: 16px;
              left: 16px;
              right: 16px;
              background-color: #2196f3;
              color: white;
              padding: 12px 16px;
              border-radius: 4px;
              z-index: 1000;
              text-align: center;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
              animation: fadeOut 3s forwards;
              animation-delay: 3s;
            }
            @keyframes fadeOut {
              from { opacity: 1; }
              to { opacity: 0; visibility: hidden; }
            }
          `}</style>
        </div>
      )}
    </>
  );
}
