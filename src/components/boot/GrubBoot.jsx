import React, { useEffect, useRef, useState } from 'react';
import './boot.css';

/**
 * GrubBoot
 * Simulates a minimal GRUB menu with a short countdown.
 * Props:
 * - onComplete: () => void — called when the GRUB screen should continue to kernel boot
 */
export default function GrubBoot({ onComplete, durationMs }) {
  // If durationMs is provided, use a fixed countdown in ms; otherwise default to 3s seconds-based countdown
  const DEFAULT_MS = 3000;
  const [remainingMs, setRemainingMs] = useState(
    typeof durationMs === 'number' ? durationMs : DEFAULT_MS
  );
  const containerRef = useRef(null);
  const tickerRef = useRef(null);
  const endTimerRef = useRef(null);

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  useEffect(() => {
    // Start a fixed-duration timer and an interval to update the displayed remaining time
    const total = typeof durationMs === 'number' ? durationMs : DEFAULT_MS;
    const start = Date.now();
    endTimerRef.current = setTimeout(() => {
      onComplete?.();
    }, total);
    tickerRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      const rem = Math.max(total - elapsed, 0);
      setRemainingMs(rem);
    }, 100);
    return () => {
      if (endTimerRef.current) clearTimeout(endTimerRef.current);
      if (tickerRef.current) clearInterval(tickerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onComplete?.();
    }
  };

  const handleClick = () => onComplete?.();

  return (
    <div
      ref={containerRef}
      className="boot-screen grub"
      tabIndex={0}
      role="dialog"
      aria-label="GRUB boot menu"
      onKeyDown={handleKeyDown}
      onClick={handleClick}
    >
      <div className="grub-frame">
        <div className="grub-title">GNU GRUB version 2.06</div>
        <ul className="grub-menu" aria-live="polite">
          <li className="selected">Debian GNU/Linux</li>
          <li>Advanced options for Debian GNU/Linux</li>
        </ul>
        <div className="grub-help">
          Use the ↑ and ↓ keys to select which entry is highlighted.
        </div>
        <div className="grub-help">Press enter to boot the selected OS.</div>
        <div className="grub-countdown">
          Booting in {Math.ceil(remainingMs / 1000)}s... (press Enter to boot now)
        </div>
      </div>
    </div>
  );
}
