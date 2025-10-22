import React from 'react';
import TopBar from './TopBar';
import './desktop.css';

/**
 * Desktop
 * Props:
 * - backgroundImageUrl?: string — path to a wallpaper image (e.g., '/wallpaper.jpg')
 * - backgroundVideoUrl?: string — path to a wallpaper video (e.g., '/wallpaper.mp4')
 */
export default function Desktop({ backgroundImageUrl, backgroundVideoUrl }) {
  return (
    <div className="desktop-root">
      <TopBar />
      <div className="desktop-canvas" role="application">
        {backgroundVideoUrl ? (
          <video
            className="desktop-bg-video"
            src={backgroundVideoUrl}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden
          />
        ) : null}
        <div
          className={`desktop-wallpaper ${backgroundVideoUrl ? 'with-video' : ''}`}
          style={backgroundImageUrl ? { backgroundImage: `url(${backgroundImageUrl})` } : undefined}
        />
        {/* Desktop icons/windows will go here in later steps */}
      </div>
    </div>
  );
}
