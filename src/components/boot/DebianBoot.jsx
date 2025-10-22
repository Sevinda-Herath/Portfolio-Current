import React, { useEffect, useRef, useState } from 'react';
import './boot.css';

/**
 * DebianBoot
 * Shows a simulated Debian boot log printing line by line.
 * Props:
 * - onComplete: () => void — called when boot sequence finishes
 */
export default function DebianBoot({ onComplete, durationMs }) {
  const [linesShown, setLinesShown] = useState(0);
  const containerRef = useRef(null);
  const logRef = useRef(null);
  const timerRef = useRef(null);
  const endRef = useRef(null);

  const bootLines = [
    '[    0.000000] Linux version 6.1.0-debian (gcc (Debian 12.2.0-3) 12.2.0) #1 SMP',
    '[    0.000000] Command line: BOOT_IMAGE=/vmlinuz root=/dev/sda1 ro quiet splash',
    '[    0.000000] x86/fpu: Supporting XSAVE feature 0x001: x87 floating point registers',
    '[    0.123456] ACPI: Early table checksum verification disabled',
    '[    0.345678] ACPI: SSDT 0x00000000 loaded',
    '[    1.012345] pci 0000:00:1f.2: AHCI controller',
    '[    1.234567] usb 1-1: new high-speed USB device number 2 using xhci_hcd',
    '[    2.000000] systemd[1]: Mounting /boot...',
    '[    2.100000] systemd[1]: Mounted /boot.',
    '[    2.300000] systemd[1]: Starting Network Manager...',
    '[    2.800000] systemd[1]: Reached target Network is Online.',
    '[    3.200000] systemd[1]: Starting GNOME Display Manager...',
    '[    3.600000] systemd[1]: Started GNOME Display Manager.',
    '[    3.900000] systemd[1]: Started User Login Management.',
    '[    4.100000] Finished Load App UI.',
  ];

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  useEffect(() => {
    const totalLines = bootLines.length;
    const totalDuration = typeof durationMs === 'number' ? Math.max(durationMs, 500) : null;
    if (totalDuration) {
      const perLine = Math.max(60, Math.floor(totalDuration / (totalLines + 1)));
      let n = 0;
      timerRef.current = setInterval(() => {
        n += 1;
        setLinesShown((prev) => Math.min(prev + 1, totalLines));
        if (n >= totalLines) {
          if (timerRef.current) clearInterval(timerRef.current);
          endRef.current = setTimeout(() => onComplete?.(), perLine);
        }
      }, perLine);
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (endRef.current) clearTimeout(endRef.current);
      };
    }

    // Default behavior without fixed duration
    if (linesShown >= totalLines) {
      const t = setTimeout(() => onComplete?.(), 700);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setLinesShown((n) => n + 1), 120);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linesShown, durationMs]);

  useEffect(() => {
    // auto-scroll to bottom as lines append
    logRef.current?.lastElementChild?.scrollIntoView({ behavior: 'smooth' });
  }, [linesShown]);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onComplete?.();
    }
  };

  const handleClick = () => onComplete?.();

  return (
    <div
      ref={containerRef}
      className="boot-screen debian"
      tabIndex={0}
      role="status"
      aria-live="polite"
      aria-label="Debian boot log"
      onKeyDown={handleKeyDown}
      onClick={handleClick}
    >
      <div className="boot-log" ref={logRef}>
        {bootLines.slice(0, linesShown).map((line, i) => (
          <div key={i} className="boot-line">{line}</div>
        ))}
        <div className="cursor" aria-hidden>_</div>
      </div>
      <div className="skip-hint">Press Esc or click to skip</div>
    </div>
  );
}
