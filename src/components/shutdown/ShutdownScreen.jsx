import React, { useEffect, useState } from 'react';
import '../boot/boot.css';

const LINES = [
  '[  OK  ] Stopping User Manager for UID 1000...',
  '[  OK  ] Stopping GNOME Display Manager...',
  '[  OK  ] Unmounting /home...',
  '[  OK  ] Stopped target Graphical Interface.',
  '[  OK  ] Stopped target Multi-User System.',
  '[  OK  ] Reached target Shutdown.',
  '[  *** ] Powering off...'
];

export default function ShutdownScreen({ durationMs = 2000, onComplete }) {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    const step = Math.max(60, Math.floor(durationMs / (LINES.length + 1)));
    let idx = 0;
    const iv = setInterval(() => {
      idx += 1;
      setVisibleCount((c) => Math.min(LINES.length, c + 1));
      if (idx >= LINES.length) {
        clearInterval(iv);
        setTimeout(() => onComplete && onComplete(), 400);
      }
    }, step);
    return () => clearInterval(iv);
  }, [durationMs, onComplete]);

  return (
    <div className="boot-screen debian" role="status" aria-live="polite" aria-label="Shutdown log">
      <div className="boot-log">
        {LINES.slice(0, visibleCount).map((t, i) => (
          <div key={i} className="boot-line">{t}</div>
        ))}
        <div className="cursor" aria-hidden>_</div>
      </div>
    </div>
  );
}
