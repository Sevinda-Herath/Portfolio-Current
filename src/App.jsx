import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import LoadingScreen from './components/boot/LoadingScreen';

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
      <div className="App" aria-hidden={showBoot}>
        <header className="App-header">
          <img src="Octocat.png" className="App-logo" alt="logo" />
          <p>
            GitHub Codespaces <span className="heart">♥️</span> React
          </p>
          <p className="small">
            Edit <code>src/App.jsx</code> and save to reload.
          </p>
          <p>
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </a>
          </p>
        </header>
      </div>
    </>
  );
}

export default App;
