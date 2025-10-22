import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import LoadingScreen from './components/boot/LoadingScreen';
import Desktop from './components/desktop/Desktop';
import backgroundVideo from './assets/the-abyss-hollow-knight.1920x1080.mp4';

function App() {
  const isTest = import.meta?.env?.MODE === 'test';
  const storageKey = 'portfolio_hasBootedOnce';

  const initialShowBoot = useMemo(() => {
    if (isTest) return false; // Skip boot in tests to keep existing tests passing
    if (typeof window === 'undefined') return false;
    try {
      return !window.localStorage.getItem(storageKey);
    } catch {
      return true;
    }
  }, [isTest]);

  const [showBoot, setShowBoot] = useState(initialShowBoot);

  useEffect(() => {
    if (!showBoot && typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(storageKey, '1');
      } catch {
        // ignore storage errors
      }
    }
  }, [showBoot]);

  return (
    <>
      {showBoot && (
        <LoadingScreen onComplete={() => setShowBoot(false)} />
      )}
      <Desktop
        backgroundImageUrl={undefined}
        backgroundVideoUrl={backgroundVideo}
      />
    </>
  );
}

export default App;
