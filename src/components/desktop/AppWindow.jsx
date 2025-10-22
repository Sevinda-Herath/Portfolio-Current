import React, { useRef } from 'react';

export default function AppWindow({
  id,
  title,
  zIndex,
  minimized,
  x,
  y,
  isFocused,
  onFocus,
  onClose,
  onMinimize,
  onDrag,
  children,
}) {
  if (minimized) return null;

  const titleId = `window-title-${id}`;
  const draggingRef = useRef(null);

  const onPointerDown = (e) => {
    // Only begin drag if initiating on the titlebar area and NOT on window controls
    const target = e.target;
    if (!(target.closest && target.closest('.app-window-titlebar'))) return;
    if (target.closest('.window-controls') || target.closest('.win-btn')) return;
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch {}
    draggingRef.current = { startX: e.clientX, startY: e.clientY, baseX: x || 0, baseY: y || 0 };
    onFocus?.();
  };

  const onPointerMove = (e) => {
    if (!draggingRef.current) return;
    const { startX, startY, baseX, baseY } = draggingRef.current;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    const nextX = baseX + dx;
    const nextY = baseY + dy;
    onDrag?.(nextX, nextY);
  };

  const onPointerUp = (e) => {
    if (!draggingRef.current) return;
    draggingRef.current = null;
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch {}
  };

  return (
    <div
      className="app-window"
      style={{ zIndex, left: x || 0, top: y || 0 }}
      role="dialog"
      aria-labelledby={titleId}
      onMouseDown={onFocus}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      data-focused={isFocused ? 'true' : 'false'}
    >
      <div className="app-window-titlebar">
        <div className="title" id={titleId}>{title}</div>
        <div className="window-controls" onPointerDown={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
          <button type="button" className="win-btn minimize" onClick={onMinimize} aria-label={`Minimize ${title}`}>_</button>
          <button type="button" className="win-btn close" onClick={onClose} aria-label={`Close ${title}`}>×</button>
        </div>
      </div>
      <div className="app-window-content">
        {children}
      </div>
    </div>
  );
}
