import React, { useEffect, useState } from 'react';

export default function TopBar() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const formatter = new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const onLogout = () => {
    try {
      localStorage.clear();
    } catch {}
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
        <button className="logout-btn" onClick={onLogout} aria-label="Log out and exit">
          Logout
        </button>
      </div>
    </div>
  );
}
