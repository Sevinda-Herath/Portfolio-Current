import React, { useMemo, useState } from 'react';
import TopBar from './TopBar';
import DesktopIcon from './DesktopIcon';
import AppWindow from './AppWindow';
import './desktop.css';
import AboutApp from '../apps/AboutApp';
import ProjectsApp from '../apps/ProjectsApp';
import ContactApp from '../apps/ContactApp';

/**
 * Desktop
 * Props:
 * - backgroundImageUrl?: string — path to a wallpaper image (e.g., '/wallpaper.jpg')
 * - backgroundVideoUrl?: string — path to a wallpaper video (e.g., '/wallpaper.mp4')
 */
export default function Desktop({ backgroundImageUrl, backgroundVideoUrl }) {
  const apps = useMemo(
    () => [
      { id: 'about', title: 'About', icon: '👤', component: AboutApp },
      { id: 'projects', title: 'Projects', icon: '🗂️', component: ProjectsApp },
      { id: 'contact', title: 'Contact', icon: '✉️', component: ContactApp },
    ], []
  );

  const [windows, setWindows] = useState([]); // { id, appId, title, minimized, z }
  const [zCounter, setZCounter] = useState(10);

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
      return [
        ...wins,
        {
          id: `${appId}-${Date.now()}`,
          appId,
          title: app.title,
          minimized: false,
          z: nextZ,
        },
      ];
    });
  };

  const closeWindow = (id) => setWindows((wins) => wins.filter((w) => w.id !== id));
  const minimizeWindow = (id) =>
    setWindows((wins) => wins.map((w) => (w.id === id ? { ...w, minimized: true } : w)));

  return (
    <div className="desktop-root">
      <TopBar />
      <div className="desktop-canvas" role="application">
        {backgroundVideoUrl ? (
          <video
            className="desktop-bg-video"
            src={backgroundVideoUrl}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden
          />
        ) : null}
        <div
          className={`desktop-wallpaper ${backgroundVideoUrl ? 'with-video' : ''}`}
          style={backgroundImageUrl ? { backgroundImage: `url(${backgroundImageUrl})` } : undefined}
        />

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
          return (
            <AppWindow
              key={w.id}
              id={w.id}
              title={w.title}
              zIndex={w.z}
              minimized={w.minimized}
              onFocus={() => bringToFront(w.id)}
              onClose={() => closeWindow(w.id)}
              onMinimize={() => minimizeWindow(w.id)}
            >
              <Comp />
            </AppWindow>
          );
        })}

        <div className="dock">
          {windows.filter((w) => w.minimized).map((w) => (
            <button
              key={`dock-${w.id}`}
              className="dock-item"
              onClick={() => bringToFront(w.id)}
            >
              {w.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
