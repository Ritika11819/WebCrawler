import React, { useState, useEffect } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, Image as ImageIcon, Sliders, Eye, EyeOff } from 'lucide-react';

export const WALLPAPERS = [
  { id: 0, title: 'Kalen Mountain Vista', url: '/wallpapers/kalen-emsley-Bkci_8qcdvQ-unsplash.jpg', author: 'Kalen Emsley' },
  { id: 1, title: 'Luca Bravo Foggy Forest', url: '/wallpapers/luca-bravo-zAjdgNXsMeg-unsplash.jpg', author: 'Luca Bravo' },
  { id: 2, title: 'Jack Anstey Aurora Peak', url: '/wallpapers/jack-anstey-XVoyX7l9ocY-unsplash.jpg', author: 'Jack Anstey' },
  { id: 3, title: 'Iswanto Horizon Glow', url: '/wallpapers/iswanto-arif-OJ74pFtrYi0-unsplash.jpg', author: 'Iswanto Arif' },
  { id: 4, title: 'Kace Sunset Valley', url: '/wallpapers/kace-rodriguez-p3OzJuT_Dks-unsplash.jpg', author: 'Kace Rodriguez' },
  { id: 5, title: 'Pietro De Grandi Lake Glow', url: '/wallpapers/pietro-de-grandi-T7K4aEPoGGk-unsplash (1).jpg', author: 'Pietro De Grandi' },
];

export function WallpaperBackground({
  currentIndex,
  onIndexChange,
  isPaused,
  onTogglePause,
  intervalSeconds = 6,
}) {
  const [blurLevel, setBlurLevel] = useState(0); // 0px to 20px extra blur
  const [dimLevel, setDimLevel] = useState(35); // 0% to 70% dim overlay
  const [showControls, setShowControls] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  // Handle continuous rotation
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      onIndexChange((prev) => (prev + 1) % WALLPAPERS.length);
    }, intervalSeconds * 1000);
    return () => clearInterval(timer);
  }, [isPaused, intervalSeconds, onIndexChange]);

  // Liquid light mouse movement listener
  useEffect(() => {
    const handleMouseMove = (e) => {
      const xPct = Math.round((e.clientX / window.innerWidth) * 100);
      const yPct = Math.round((e.clientY / window.innerHeight) * 100);
      setMousePos({ x: xPct, y: yPct });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const nextWallpaper = () => {
    onIndexChange((currentIndex + 1) % WALLPAPERS.length);
  };

  const prevWallpaper = () => {
    onIndexChange((currentIndex - 1 + WALLPAPERS.length) % WALLPAPERS.length);
  };

  return (
    <div className="wallpaper-container">
      {/* Background Image Stack for Continuous Crossfade */}
      <div
        className="wallpaper-stack"
        style={{
          filter: blurLevel > 0 ? `blur(${blurLevel}px)` : 'none',
          transition: 'filter 0.5s ease',
        }}
      >
        {WALLPAPERS.map((wp, idx) => (
          <div
            key={wp.id}
            className={`wallpaper-slide ${idx === currentIndex ? 'active' : ''}`}
            style={{
              backgroundImage: `url("${wp.url}")`,
            }}
            aria-hidden={idx !== currentIndex}
          />
        ))}
      </div>

      {/* Dynamic Ambient Glass Glow following mouse (Liquid Light Effect) */}
      <div
        className="liquid-ambient-glow"
        style={{
          background: `radial-gradient(circle 600px at ${mousePos.x}% ${mousePos.y}%, rgba(120, 119, 198, 0.22), rgba(255, 255, 255, 0.05) 50%, transparent 80%)`,
        }}
        aria-hidden="true"
      />

      {/* Customizable Dim Overlay */}
      <div
        className="wallpaper-overlay"
        style={{
          backgroundColor: `rgba(10, 14, 26, ${dimLevel / 100})`,
        }}
        aria-hidden="true"
      />

      {/* Floating Liquid Glass Wallpaper Control Pill */}
      <div className={`wallpaper-floating-dock ${showControls ? 'expanded' : ''}`}>
        <button
          className="glass-dock-btn"
          onClick={() => setShowControls(!showControls)}
          title="Wallpaper Studio & Settings"
          aria-label="Wallpaper studio"
        >
          <ImageIcon size={16} />
          <span className="dock-label">Wallpaper Studio</span>
        </button>

        {showControls && (
          <div className="glass-wallpaper-panel glass-card-interactive">
            <div className="panel-header">
              <span className="panel-title">Continuous Background Studio</span>
              <button className="panel-close" onClick={() => setShowControls(false)}>
                &times;
              </button>
            </div>

            <div className="panel-info">
              <span className="wallpaper-name">{WALLPAPERS[currentIndex].title}</span>
              <span className="wallpaper-author">Photo by {WALLPAPERS[currentIndex].author}</span>
            </div>

            {/* Thumbnails strip */}
            <div className="thumbnail-strip">
              {WALLPAPERS.map((wp, idx) => (
                <button
                  key={wp.id}
                  className={`thumb-btn ${idx === currentIndex ? 'selected' : ''}`}
                  onClick={() => onIndexChange(idx)}
                  style={{ backgroundImage: `url("${wp.url}")` }}
                  title={wp.title}
                />
              ))}
            </div>

            {/* Playback Controls */}
            <div className="controls-row">
              <button className="glass-icon-btn" onClick={prevWallpaper} title="Previous Background">
                <ChevronLeft size={16} />
              </button>
              <button
                className={`glass-icon-btn ${isPaused ? 'play' : 'pause'}`}
                onClick={onTogglePause}
                title={isPaused ? 'Resume Auto-rotation' : 'Pause Auto-rotation'}
              >
                {isPaused ? <Play size={16} /> : <Pause size={16} />}
                <span className="btn-text">{isPaused ? 'Paused' : 'Auto Rotating'}</span>
              </button>
              <button className="glass-icon-btn" onClick={nextWallpaper} title="Next Background">
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Sliders for Blur & Dim */}
            <div className="sliders-section">
              <div className="slider-group">
                <label>
                  <span>Glass Blur</span>
                  <span>{blurLevel}px</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="16"
                  value={blurLevel}
                  onChange={(e) => setBlurLevel(Number(e.target.value))}
                />
              </div>
              <div className="slider-group">
                <label>
                  <span>Background Dim</span>
                  <span>{dimLevel}%</span>
                </label>
                <input
                  type="range"
                  min="10"
                  max="70"
                  value={dimLevel}
                  onChange={(e) => setDimLevel(Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
