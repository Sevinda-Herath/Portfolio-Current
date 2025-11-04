import React, { useEffect, useRef, useState } from 'react';

export default function AppWindow({
  id,
  title,
  zIndex,
  minimized,
  x,
  y,
  width,
  height,
  isFocused,
  canDrag = true,
  isMobileMode = false,
  isMaximized = false,
  onFocus,
  onClose,
  onMinimize,
  onDrag,
  onDragEnd,
  onResize,
  onToggleMaximize,
  children,
}) {
  if (minimized) return null;

  const titleId = `window-title-${id}`;
  const draggingRef = useRef(null);
  const resizingRef = useRef(null); // { dir, startX, startY, baseX, baseY, baseW, baseH }
  const [leaving, setLeaving] = useState(false);
  const contentRef = useRef(null);
  const [hasBottomFade, setHasBottomFade] = useState(false);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const updateFades = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      setHasBottomFade(scrollTop + clientHeight < scrollHeight - 1);
    };
    updateFades();
    el.addEventListener('scroll', updateFades);
    window.addEventListener('resize', updateFades);
    const ro = new (window.ResizeObserver || class { observe(){} disconnect(){} })((entries) => updateFades());
    try { ro.observe(el); } catch {}
    return () => {
      el.removeEventListener('scroll', updateFades);
      window.removeEventListener('resize', updateFades);
      try { ro.disconnect(); } catch {}
    };
  }, [children]);

  const onPointerDown = (e) => {
  if (!canDrag) return;
    // Only begin drag if initiating on the titlebar area and NOT on window controls
    const target = e.target;
    if (!(target.closest && target.closest('.app-window-titlebar'))) return;
    if (target.closest('.window-controls') || target.closest('.win-btn')) return;
    // Improve touch behavior: prevent browser panning/scroll gestures from hijacking drag
    if (e.pointerType === 'touch') {
      try { e.preventDefault(); } catch {}
    }
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch {}
    draggingRef.current = { startX: e.clientX, startY: e.clientY, baseX: x || 0, baseY: y || 0, active: false };
    onFocus?.();
  };

  const onPointerMove = (e) => {
    // Resizing has priority over dragging
    if (resizingRef.current && onResize && !isMobileMode) {
      const { dir, startX, startY, baseX, baseY, baseW, baseH } = resizingRef.current;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const MIN_W = 320;
      const MIN_H = 220;
      let nx = baseX;
      let ny = baseY;
      let nw = baseW;
      let nh = baseH;
      if (dir.includes('e')) {
        nw = Math.max(MIN_W, baseW + dx);
      }
      if (dir.includes('s')) {
        nh = Math.max(MIN_H, baseH + dy);
      }
      if (dir.includes('w')) {
        const newW = Math.max(MIN_W, baseW - dx);
        nx = baseX + (baseW - newW);
        nw = newW;
      }
      if (dir.includes('n')) {
        const newH = Math.max(MIN_H, baseH - dy);
        ny = baseY + (baseH - newH);
        nh = newH;
      }
      onResize?.(nx, ny, nw, nh);
      return;
    }
    if (!canDrag) return;
    if (!draggingRef.current) return;
    const { startX, startY, baseX, baseY, active } = draggingRef.current;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (!active) {
      const dist = Math.hypot(dx, dy);
      if (dist < 6) return;
      draggingRef.current.active = true;
    }
    const nextX = baseX + dx;
    const nextY = baseY + dy;
    onDrag?.(nextX, nextY);
  };

  const onPointerUp = (e) => {
    // Complete resize or drag
    if (resizingRef.current) {
      resizingRef.current = null;
      try { e.currentTarget.releasePointerCapture(e.pointerId); } catch {}
      return;
    }
    if (draggingRef.current) {
      const wasActive = draggingRef.current.active;
      draggingRef.current = null;
      try { e.currentTarget.releasePointerCapture(e.pointerId); } catch {}
      if (wasActive) onDragEnd?.();
    }
  };

  // Start resize from a handle
  const startResize = (e, dir) => {
    if (isMobileMode) return;
    e.stopPropagation();
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch {}
    resizingRef.current = {
      dir,
      startX: e.clientX,
      startY: e.clientY,
      baseX: x || 0,
      baseY: y || 0,
      baseW: width || 0,
      baseH: height || 0,
    };
    onFocus?.();
  };

  return (
    <div
      className="app-window"
      style={
        isMobileMode
          ? { zIndex }
          : {
              zIndex,
              left: 0,
              top: 0,
              transform: `translate3d(${x || 0}px, ${y || 0}px, 0)`,
              willChange: 'transform,width,height',
              ...(width ? { width } : {}),
              ...(height ? { height } : {}),
            }
      }
      role="dialog"
      aria-labelledby={titleId}
      onMouseDown={onFocus}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      data-focused={isFocused ? 'true' : 'false'}
      data-draggable={canDrag ? 'true' : 'false'}
      data-mobile={isMobileMode ? 'true' : 'false'}
      data-state={leaving ? 'leaving' : 'entered'}
    >
      <div className="app-window-inner">
        <div className="app-window-titlebar">
        <div className="title" id={titleId}>{title}</div>
        <div className="window-controls" onPointerDown={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
          <button
            type="button"
            className="win-btn minimize"
            onClick={() => {
              if (!isMobileMode) return onMinimize?.();
              setLeaving(true);
              setTimeout(() => onMinimize?.(), 180);
            }}
            aria-label={`Minimize ${title}`}
          >
            _
          </button>
          {!isMobileMode && (
            <button
              type="button"
              className="win-btn maximize"
              onClick={() => onToggleMaximize?.()}
              aria-label={`${isMaximized ? 'Restore' : 'Maximize'} ${title}`}
              title={isMaximized ? 'Restore' : 'Maximize'}
            >
              {isMaximized ? '❐' : '☐'}
            </button>
          )}
          <button
            type="button"
            className="win-btn close"
            onClick={() => {
              if (!isMobileMode) return onClose?.();
              setLeaving(true);
              setTimeout(() => onClose?.(), 180);
            }}
            aria-label={`Close ${title}`}
          >
            ×
          </button>
        </div>
        </div>
        <div className="app-window-content" ref={contentRef}>
          {children}
        </div>
      </div>

      {/* Bottom fade sits outside the scroll area and the inner wrapper */}
      <div className={`scroll-fade-bottom${hasBottomFade ? ' visible' : ''}`} aria-hidden />

      {/* Resize handles (hidden on mobile) */}
      {!isMobileMode && !isMaximized && (
        <>
          <div className="resize-handle n" onPointerDown={(e) => startResize(e, 'n')} />
          <div className="resize-handle s" onPointerDown={(e) => startResize(e, 's')} />
          <div className="resize-handle e" onPointerDown={(e) => startResize(e, 'e')} />
          <div className="resize-handle w" onPointerDown={(e) => startResize(e, 'w')} />
          <div className="resize-handle ne" onPointerDown={(e) => startResize(e, 'ne')} />
          <div className="resize-handle nw" onPointerDown={(e) => startResize(e, 'nw')} />
          <div className="resize-handle se" onPointerDown={(e) => startResize(e, 'se')} />
          <div className="resize-handle sw" onPointerDown={(e) => startResize(e, 'sw')} />
        </>
      )}
    </div>
  );
}
