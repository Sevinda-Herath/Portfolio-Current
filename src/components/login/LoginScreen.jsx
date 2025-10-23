import React, { useEffect, useMemo, useRef, useState } from 'react';
import './login.css';

/**
 * GNOME-like login screen (aesthetic only)
 * Props:
 * - onComplete: () => void
 * - backgroundImageUrl?: string
 * - backgroundVideoWebmUrl?: string
 * - backgroundVideoMp4Url?: string
 * - backgroundPosterUrl?: string
 * - username?: string (default: 'Sevinda')
 */
export default function LoginScreen({
  onComplete,
  backgroundImageUrl,
  backgroundVideoWebmUrl,
  backgroundVideoMp4Url,
  backgroundPosterUrl,
  username = 'Sevinda-Herath',
}) {
  const [typedUser, setTypedUser] = useState('');
  const [typedPass, setTypedPass] = useState('');
  const [stage, setStage] = useState('typingUser'); // typingUser -> typingPass -> ready
  const containerRef = useRef(null);

  const password = useMemo(() => 'password', []);

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  useEffect(() => {
    let t;
    if (stage === 'typingUser') {
      if (typedUser.length < username.length) {
        t = setTimeout(() => setTypedUser(username.slice(0, typedUser.length + 1)), 90);
      } else {
        setStage('typingPass');
      }
    } else if (stage === 'typingPass') {
      if (typedPass.length < password.length) {
        t = setTimeout(() => setTypedPass(password.slice(0, typedPass.length + 1)), 80);
      } else {
        setStage('ready');
      }
    }
    return () => t && clearTimeout(t);
  }, [stage, typedUser, typedPass, username, password]);

  const handleKeyDown = () => {
    // Intentionally no-op: require clicking the Sign In button to proceed.
  };

  return (
    <div
      ref={containerRef}
      className="login-root"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-label="Login"
    >
      {backgroundVideoWebmUrl || backgroundVideoMp4Url ? (
        <video
          className="login-bg-video"
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
        className={`login-wallpaper ${backgroundVideoWebmUrl || backgroundVideoMp4Url ? 'with-video' : ''}`}
        style={backgroundImageUrl ? { backgroundImage: `url(${backgroundImageUrl})` } : undefined}
      />

      <div className="login-clock" aria-live="polite">
        <Clock />
      </div>

      <div className="login-panel">
        <div className="avatar" aria-hidden>🧑‍💻</div>
        <div className="fields">
          <label className="field">
            <span className="label">Username</span>
            <input value={typedUser} readOnly aria-readonly placeholder="Username" />
          </label>
          <label className="field">
            <span className="label">Password</span>
            <input value={typedPass} type="password" readOnly aria-readonly placeholder="Password" />
          </label>
        </div>
        <div className="login-actions">
          <button className="login-btn" onClick={() => onComplete?.()} aria-label="Sign In">
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}

function Clock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const dateStr = new Intl.DateTimeFormat(undefined, {
    weekday: 'long', month: 'long', day: '2-digit'
  }).format(now);
  const timeStr = new Intl.DateTimeFormat(undefined, {
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  }).format(now);
  return (
    <div className="clock-wrap">
      <div className="clock-time">{timeStr}</div>
      <div className="clock-date">{dateStr}</div>
    </div>
  );
}
