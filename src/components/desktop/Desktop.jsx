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

  const [windows, setWindows] = useState([]); // { id, appId, title, minimized, z, x, y, width, height }
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
      const vw = typeof window !== 'undefined' ? window.innerWidth : 1200;
      const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
      const topbar = 44;
      const availW = Math.max(320, Math.min(900, Math.floor(vw * 0.6)));
      const availH = Math.max(240, Math.min(Math.floor((vh - topbar) * 0.7), 700));
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
          width: availW,
          height: availH,
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
    // Coordinates are relative to .desktop-canvas (which is offset by topbar already)
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
    const topbar = 44;
    const canvasH = vh - topbar;
    const minX = 0, minY = 0;
    const maxX = vw - 120; // conservative width estimate
    const maxY = canvasH - 80; // conservative height estimate within canvas
    const clampedX = Math.max(minX, Math.min(nextX, maxX));
    const clampedY = Math.max(minY, Math.min(nextY, maxY));
    setWindows((wins) => wins.map((w) => (w.id === id ? { ...w, x: clampedX, y: clampedY } : w)));
  };

  const resizeWindow = (id, nx, ny, nw, nh) => {
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
    const topbar = 44;
    const canvasH = vh - topbar;
    const minW = 320, minH = 220;
    const maxW = vw - 20;
    const maxH = canvasH - 16;
    const clampedW = Math.max(minW, Math.min(nw, maxW));
    const clampedH = Math.max(minH, Math.min(nh, maxH));
    const clampedX = Math.max(0, Math.min(nx, vw - clampedW));
    const clampedY = Math.max(0, Math.min(ny, canvasH - clampedH));
    setWindows((wins) => wins.map((w) => (w.id === id ? { ...w, x: clampedX, y: clampedY, width: clampedW, height: clampedH } : w)));
  };

  const snapWindowIfNeeded = (id) => {
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
    const topbar = 44;
    const areaX = 0, areaY = 0, areaW = vw, areaH = vh - topbar; // canvas area
    const SNAP = 32; // px threshold to snap
    setWindows((wins) => wins.map((w) => {
      if (w.id !== id) return w;
      const nearLeft = w.x <= SNAP;
      const nearRight = areaX + areaW - (w.x + (w.width || 400)) <= SNAP;
      const nearTop = w.y - areaY <= SNAP;
      const nearBottom = areaY + areaH - (w.y + (w.height || 300)) <= SNAP;

      // Corner snap (quarters)
      if ((nearLeft && nearTop) || (nearLeft && nearBottom) || (nearRight && nearTop) || (nearRight && nearBottom)) {
        const halfW = Math.floor(areaW / 2);
        const halfH = Math.floor(areaH / 2);
        const newW = halfW - 8;
        const newH = halfH - 8;
        const nx = nearLeft ? areaX + 4 : areaX + halfW + 4;
        const ny = nearTop ? areaY + 4 : areaY + halfH + 4;
        return { ...w, x: nx, y: ny, width: newW, height: newH };
      }
      // Side snap (halves)
      if (nearLeft) {
        return { ...w, x: areaX + 4, y: areaY + 4, width: Math.floor(areaW / 2) - 8, height: areaH - 8 };
      }
      if (nearRight) {
        return { ...w, x: areaX + Math.floor(areaW / 2) + 4, y: areaY + 4, width: Math.floor(areaW / 2) - 8, height: areaH - 8 };
      }
      // Top snap (maximize height)
      if (nearTop) {
        return { ...w, x: Math.max(4, Math.min(w.x, areaW - (w.width || 400) - 4)), y: areaY + 4, height: areaH - 8 };
      }
      return w;
    }));
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
              width={w.width}
              height={w.height}
              isFocused={w.z === maxZ}
              isMobileMode={isSmall}
              canDrag={!isSmall}
              onFocus={() => bringToFront(w.id)}
              onClose={() => closeWindow(w.id)}
              onMinimize={() => minimizeWindow(w.id)}
              onDrag={(nx, ny) => dragWindow(w.id, nx, ny)}
              onDragEnd={() => snapWindowIfNeeded(w.id)}
              onResize={(nx, ny, nw, nh) => resizeWindow(w.id, nx, ny, nw, nh)}
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
