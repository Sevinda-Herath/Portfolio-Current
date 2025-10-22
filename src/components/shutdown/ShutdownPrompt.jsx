import React from 'react';

export default function ShutdownPrompt({ onCancel, onConfirm }) {
  return (
    <div className="shutdown-prompt-overlay" role="presentation">
      <div
        className="shutdown-prompt"
        role="dialog"
        aria-modal="true"
        aria-labelledby="shutdown-title"
        aria-describedby="shutdown-desc"
      >
        <div className="shutdown-prompt-header">
          <h2 id="shutdown-title">Power Off</h2>
        </div>
        <div className="shutdown-prompt-body">
          <p id="shutdown-desc">Do you want to shut down this system now?</p>
        </div>
        <div className="shutdown-prompt-actions">
          <button className="btn-secondary" onClick={onCancel} autoFocus>
            Cancel
          </button>
          <button className="btn-primary" onClick={onConfirm}>
            Power Off
          </button>
        </div>
      </div>
    </div>
  );
}
