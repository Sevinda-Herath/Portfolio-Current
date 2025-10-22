import React from 'react';

export default function AppWindow({
  id,
  title,
  zIndex,
  minimized,
  onFocus,
  onClose,
  onMinimize,
  children,
}) {
  if (minimized) return null;

  const titleId = `window-title-${id}`;

  return (
    <div
      className="app-window"
      style={{ zIndex }}
      role="dialog"
      aria-labelledby={titleId}
      onMouseDown={onFocus}
    >
      <div className="app-window-titlebar">
        <div className="title" id={titleId}>{title}</div>
        <div className="window-controls">
          <button className="win-btn minimize" onClick={onMinimize} aria-label={`Minimize ${title}`}>_</button>
          <button className="win-btn close" onClick={onClose} aria-label={`Close ${title}`}>×</button>
        </div>
      </div>
      <div className="app-window-content">
        {children}
      </div>
    </div>
  );
}
