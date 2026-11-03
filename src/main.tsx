import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register Service Worker for 100% offline functionality
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  registerSW({
    immediate: true,
    onNeedRefresh() {
      console.log('App update available');
    },
    onOfflineReady() {
      console.log('عالم الحروف جاهز للعمل بالكامل بدون إنترنت 100% (Offline Ready)');
    },
  });
}

createRoot(document.getElementById('root')!).render(<App />);
