import React, { useEffect, useMemo, useState } from 'react';

export default function TopBar({ onLogoutRequested }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const formatter = useMemo(() => new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }), []);

  const onLogout = () => {
    if (typeof onLogoutRequested === 'function') {
      onLogoutRequested();
      return;
    }
    // Fallback: immediate clear + redirect
    try { localStorage.clear(); } catch {}
    window.location.href = 'https://google.com';
  };

  return (
    <div className="topbar" role="banner">
      <div className="topbar-left" aria-hidden>
        {/* Placeholder for Activities/Apps menu */}
      </div>
      <div className="topbar-center" aria-live="polite">
        {formatter.format(now)}
      </div>
      <div className="topbar-right">
        <button className="logout-btn" onClick={onLogout} aria-label="Log out" title="Log out">
          {/* Power icon */}
          <span aria-hidden>⏻</span>
        </button>
      </div>
    </div>
  );
}
