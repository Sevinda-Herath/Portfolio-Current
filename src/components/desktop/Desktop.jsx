import React, { useEffect, useMemo, useState } from 'react';
import TopBar from './TopBar';
import DesktopIcon from './DesktopIcon';
import AppWindow from './AppWindow';
import './desktop.css';
import AboutApp from '../apps/AboutApp';
import ProjectsApp from '../apps/ProjectsApp';
import ContactApp from '../apps/ContactApp';
import ShutdownPrompt from '../shutdown/ShutdownPrompt';
import ShutdownScreen from '../shutdown/ShutdownScreen';

/**
 * Desktop
 * Props:
 * - backgroundImageUrl?: string — path to a wallpaper image (e.g., '/wallpaper.jpg')
 * - backgroundVideoUrl?: string — path to a wallpaper video (e.g., '/wallpaper.mp4')
 */
export default function Desktop({
  backgroundImageUrl,
  backgroundVideoWebmUrl,
  backgroundVideoMp4Url,
  backgroundPosterUrl,
}) {
  const apps = useMemo(
    () => [
      { id: 'about', title: 'About', icon: '👤', component: AboutApp },
      { id: 'projects', title: 'Projects', icon: '🗂️', component: ProjectsApp },
      { id: 'contact', title: 'Contact', icon: '✉️', component: ContactApp },
    ], []
  );

  const [windows, setWindows] = useState([]); // { id, appId, title, minimized, z, x, y }
  const [zCounter, setZCounter] = useState(10);
  const [isSmall, setIsSmall] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showShutdown, setShowShutdown] = useState(false);

  useEffect(() => {
    const update = () => setIsSmall(typeof window !== 'undefined' ? window.innerWidth <= 540 : false);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const bringToFront = (id) => {
    setWindows((wins) => {
      const nextZ = zCounter + 1;
      setZCounter(nextZ);
      return wins.map((w) => (w.id === id ? { ...w, z: nextZ } : w));
    });
  };

  const openApp = (appId) => {
    setWindows((wins) => {
      const existing = wins.find((w) => w.appId === appId);
      if (existing) {
        // restore and focus
        const nextZ = zCounter + 1;
        setZCounter(nextZ);
        return wins.map((w) =>
          w.appId === appId ? { ...w, minimized: false, z: nextZ } : w
        );
      }
      const app = apps.find((a) => a.id === appId);
      if (!app) return wins;
      const nextZ = zCounter + 1;
      setZCounter(nextZ);
      const count = wins.length;
      const baseX = 80 + (count % 5) * 40;
      const baseY = 90 + (count % 5) * 30;
      return [
        ...wins,
        {
          id: `${appId}-${Date.now()}`,
          appId,
          title: app.title,
          minimized: false,
          z: nextZ,
          x: baseX,
          y: baseY,
        },
      ];
    });
  };

  const closeWindow = (id) => setWindows((wins) => wins.filter((w) => w.id !== id));
  const minimizeWindow = (id) =>
    setWindows((wins) => wins.map((w) => (w.id === id ? { ...w, minimized: true } : w)));

  const restoreFromDock = (id) => {
    const nextZ = zCounter + 1;
    setZCounter(nextZ);
    setWindows((wins) => wins.map((w) => (w.id === id ? { ...w, minimized: false, z: nextZ } : w)));
  };

  const dragWindow = (id, nextX, nextY) => {
    // Clamp to viewport with some margins
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
    const topbar = 44;
    const minX = 0, minY = topbar;
    const maxX = vw - 200; // conservative width estimate
    const maxY = vh - 120; // conservative height estimate
    const clampedX = Math.max(minX, Math.min(nextX, maxX));
    const clampedY = Math.max(minY, Math.min(nextY, maxY));
    setWindows((wins) => wins.map((w) => (w.id === id ? { ...w, x: clampedX, y: clampedY } : w)));
  };

  return (
    <div className="desktop-root">
      <TopBar onLogoutRequested={() => setShowPrompt(true)} />
      <div className="desktop-canvas" role="application">
        {backgroundVideoWebmUrl || backgroundVideoMp4Url ? (
          <video
            className="desktop-bg-video"
            preload="auto"
            autoPlay
            muted
            loop
            playsInline
            aria-hidden
            poster={backgroundPosterUrl}
          >
            {backgroundVideoWebmUrl ? (
              <source src={backgroundVideoWebmUrl} type="video/webm" />
            ) : null}
            {backgroundVideoMp4Url ? (
              <source src={backgroundVideoMp4Url} type="video/mp4" />
            ) : null}
          </video>
        ) : null}
        <div
          className={`desktop-wallpaper ${backgroundVideoWebmUrl || backgroundVideoMp4Url ? 'with-video' : ''}`}
          style={backgroundImageUrl ? { backgroundImage: `url(${backgroundImageUrl})` } : undefined}
        />

        {/* Background welcome text overlay */}
        <div className="welcome-overlay" aria-hidden>
          <h1 className="welcome-title">Hello, I'm Sevinda Herath</h1>
          <p className="welcome-sub">Welcome to my website!</p>
        </div>

        <div className="icons-grid">
          {apps.map((app) => (
            <DesktopIcon
              key={app.id}
              title={app.title}
              icon={app.icon}
              onOpen={() => openApp(app.id)}
            />
          ))}
        </div>

        {windows.map((w) => {
          const app = apps.find((a) => a.id === w.appId);
          const Comp = app?.component ?? (() => null);
          const maxZ = windows.filter((x) => !x.minimized).reduce((m, x) => Math.max(m, x.z), 0);
          return (
            <AppWindow
              key={w.id}
              id={w.id}
              title={w.title}
              zIndex={w.z}
              minimized={w.minimized}
              x={w.x}
              y={w.y}
              isFocused={w.z === maxZ}
              isMobileMode={isSmall}
              canDrag={!isSmall}
              onFocus={() => bringToFront(w.id)}
              onClose={() => closeWindow(w.id)}
              onMinimize={() => minimizeWindow(w.id)}
              onDrag={(nx, ny) => dragWindow(w.id, nx, ny)}
            >
              <Comp />
            </AppWindow>
          );
        })}

        <div className="dock">
          <div className="dock-glass">
            {windows.filter((w) => w.minimized).map((w) => {
              const app = apps.find((a) => a.id === w.appId);
              const icon = app?.icon ?? '🗔';
              return (
                <button
                  key={`dock-${w.id}`}
                  className="dock-item"
                  onClick={() => restoreFromDock(w.id)}
                  aria-label={`Restore ${w.title}`}
                  title={w.title}
                >
                  <span className="dock-icon" aria-hidden>{icon}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Shutdown Prompt */}
        {showPrompt && (
          <ShutdownPrompt
            onCancel={() => setShowPrompt(false)}
            onConfirm={() => {
              setShowPrompt(false);
              setShowShutdown(true);
            }}
          />
        )}

        {/* Shutdown Screen */}
        {showShutdown && (
          <ShutdownScreen
            durationMs={2200}
            onComplete={() => {
              try { localStorage.clear(); } catch {}
              window.location.href = 'https://google.com';
            }}
          />
        )}
      </div>
    </div>
  );
}
