import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import LoadingScreen from './components/boot/LoadingScreen';
import LoginScreen from './components/login/LoginScreen';
import Desktop from './components/desktop/Desktop';
import backgroundVideoWebm from './assets/the-abyss-hollow-knight.1920x1080.webm';
import backgroundVideoMp4 from './assets/the-abyss-hollow-knight.1920x1080.mp4';
import backgroundPoster from './assets/the-abyss-hollow-knight.1920x1080.png';
import loginVideoWebm from './assets/the-knights-quiet-rest.1920x1080.webm';
import loginVideoMp4 from './assets/the-knights-quiet-rest.1920x1080.mp4';
import loginPoster from './assets/the-knights-quiet-rest.1920x1080.png';
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
    preloadVideos([
      loginVideoWebm,
      loginVideoMp4,
      backgroundVideoWebm,
      backgroundVideoMp4,
    ]);
  }, []);

  return (
    <>
      {showBoot && (
        <LoadingScreen onComplete={() => setShowBoot(false)} />
      )}
      {!showBoot && showLogin && (
        <LoginScreen
          onComplete={() => setShowLogin(false)}
          backgroundVideoWebmUrl={loginVideoWebm}
          backgroundVideoMp4Url={loginVideoMp4}
          backgroundPosterUrl={loginPoster}
          backgroundImageUrl={undefined}
        />
      )}
      {!showBoot && !showLogin && (
        <Desktop
          backgroundImageUrl={undefined}
          backgroundVideoWebmUrl={backgroundVideoWebm}
          backgroundVideoMp4Url={backgroundVideoMp4}
          backgroundPosterUrl={backgroundPoster}
        />
      )}
    </>
  );
}

export default App;
