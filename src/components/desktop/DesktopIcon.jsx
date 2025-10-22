import React from 'react';

export default function DesktopIcon({ title, icon, onOpen }) {
  return (
    <button className="desktop-icon" onClick={onOpen} aria-label={`Open ${title}`}>
      <div className="desktop-icon-art" aria-hidden>{icon}</div>
      <div className="desktop-icon-title">{title}</div>
    </button>
  );
}
