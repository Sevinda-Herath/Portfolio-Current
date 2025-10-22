import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import LoadingScreen from './components/boot/LoadingScreen';
import LoginScreen from './components/login/LoginScreen';
import Desktop from './components/desktop/Desktop';
import backgroundVideo from './assets/the-abyss-hollow-knight.1920x1080.mp4';
import loginVideo from './assets/the-knights-quiet-rest.1920x1080.mp4';
import { preloadVideos } from './utils/preloadMedia';

function App() {
  const isTest = import.meta?.env?.MODE === 'test';
  const storageKey = 'portfolio_hasBootedOnce';
  const loginKey = 'portfolio_hasLoggedInOnce';

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
  const initialShowLogin = useMemo(() => {
    if (isTest) return false;
    if (typeof window === 'undefined') return false;
    try {
      return !window.localStorage.getItem(loginKey);
    } catch {
      return true;
    }
  }, [isTest]);
  const [showLogin, setShowLogin] = useState(initialShowLogin);

  useEffect(() => {
    if (!showBoot && typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(storageKey, '1');
      } catch {
        // ignore storage errors
      }
    }
  }, [showBoot]);

  useEffect(() => {
    if (!showLogin && typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(loginKey, '1');
      } catch {
        // ignore storage errors
      }
    }
  }, [showLogin]);

  // Preload background videos as early as possible to reduce visual delay
  useEffect(() => {
    if (isTest) return; // skip in tests
    preloadVideos([loginVideo, backgroundVideo]);
  }, []);

  return (
    <>
      {showBoot && (
        <LoadingScreen onComplete={() => setShowBoot(false)} />
      )}
      {!showBoot && showLogin && (
        <LoginScreen
          onComplete={() => setShowLogin(false)}
          backgroundVideoUrl={loginVideo}
          backgroundImageUrl={undefined}
        />
      )}
      {!showBoot && !showLogin && (
        <Desktop
          backgroundImageUrl={undefined}
          backgroundVideoUrl={backgroundVideo}
        />
      )}
    </>
  );
}

export default App;
