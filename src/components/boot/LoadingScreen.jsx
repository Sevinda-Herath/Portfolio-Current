import React, { useCallback, useState } from 'react';
import GrubBoot from './GrubBoot';
import DebianBoot from './DebianBoot';
import './boot.css';

/**
 * LoadingScreen orchestrates GRUB -> Debian boot sequence, full screen.
 * Props:
 * - onComplete: () => void
 */
export default function LoadingScreen({ onComplete, grubDurationMs = 3000, debianDurationMs = 3500 }) {
  const [stage, setStage] = useState('grub'); // 'grub' | 'debian'

  const handleGrubComplete = useCallback(() => setStage('debian'), []);
  const handleDebianComplete = useCallback(() => onComplete?.(), [onComplete]);

  return (
    <div className="boot-root">
      {stage === 'grub' ? (
        <GrubBoot onComplete={handleGrubComplete} durationMs={grubDurationMs} />
      ) : (
        <DebianBoot onComplete={handleDebianComplete} durationMs={debianDurationMs} />
      )}
    </div>
  );
}
