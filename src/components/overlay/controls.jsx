import { useState, useEffect } from 'react';
import './controls.css';

function Controls() {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMinimized(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const toggleControls = () => {
    setIsMinimized(!isMinimized);
  };

  const closeControls = () => {
    setIsVisible(false);
  };

  const openControls = () => {
    setIsVisible(true);
    setIsMinimized(false);
  };

  if (!isVisible) {
    return (
      <button className="help-icon" onClick={openControls}>
        ?
      </button>
    );
  }

  return (
    <div className={`controls-container ${isMinimized ? 'minimized' : ''}`}>
      {!isMinimized ? (
        <div className="mouse-controls-overlay">
          <button className="close-btn" onClick={closeControls} title="Close Controls">
            ×
          </button>
          <div className="mouse-graphic">
            <div className="mouse-body">
              <div className="mouse-button left-click">L</div>
              <div className="mouse-button right-click">R</div>
              <div className="mouse-wheel"></div>
            </div>
          </div>
          <div className="controls-labels">
            <div className="label">Left Click + Drag = Rotate</div>
            <div className="label">Right Click + Drag = Pan</div>
            <div className="label">Scroll = Zoom</div>
          </div>
        </div>
      ) : (
        <button className="help-icon" onClick={toggleControls}>
          ?
        </button>
      )}
    </div>
  );
}

export default Controls;