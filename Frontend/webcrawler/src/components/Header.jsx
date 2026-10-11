import React from 'react';
import { Sparkles, Globe, Server, HelpCircle, Layers, BarChart3, Radio, Code2, Network } from 'lucide-react';

export function Header({
  activeTab,
  onTabChange,
  isBackendConnected,
  useRealBackend,
  onOpenBackendConfig,
  onOpenGuide,
  wallpaperIndex,
}) {
  return (
    <header className="header-glass">
      <div className="header-left">
        <a href="/" className="brand-link" onClick={(e) => { e.preventDefault(); onTabChange('overview'); }}>
          <div className="brand-logo-glass">
            <Sparkles className="logo-sparkle-icon" size={20} />
            <div className="logo-inner-glow" />
          </div>
          <div className="brand-title-wrap">
            <span className="brand-name">SearchGenie</span>
            <span className="brand-tagline">Frontier URL Crawler</span>
          </div>
        </a>
      </div>

      <nav className="header-center-nav">
        <div className="nav-pill-container glass-pill">
          <button
            className={`nav-item-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => onTabChange('overview')}
          >
            <Globe size={15} />
            <span>Frontier Search</span>
          </button>
          <button
            className={`nav-item-btn ${activeTab === 'shortcuts' ? 'active' : ''}`}
            onClick={() => onTabChange('shortcuts')}
          >
            <Layers size={15} />
            <span>Top Shortcuts</span>
          </button>
          <button
            className={`nav-item-btn ${activeTab === 'tree' ? 'active' : ''}`}
            onClick={() => onTabChange('tree')}
          >
            <Network size={15} />
            <span>URL Tree</span>
          </button>
          <button
            className={`nav-item-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => onTabChange('analytics')}
          >
            <BarChart3 size={15} />
            <span>Frequency Stats</span>
          </button>
        </div>
      </nav>

      <div className="header-right">
        {/* Backend Connectivity Status Chip */}
        <button
          className={`backend-status-chip ${useRealBackend ? 'live-backend' : 'simulated-backend'}`}
          onClick={onOpenBackendConfig}
          title="Click to configure Backend REST / WebSocket API"
        >
          <Server size={14} />
          <span className="status-text">
            {useRealBackend ? 'Backend Connected' : 'Simulated Engine'}
          </span>
          <span className="status-dot-pulse" />
        </button>

        {/* How Web Crawling Works Guide Launcher */}
        <button
          className="header-action-btn glass-btn"
          onClick={onOpenGuide}
          title="Learn Web Crawler Architecture & Frontier Queue"
        >
          <HelpCircle size={16} />
          <span className="btn-label">How it works</span>
        </button>

        {/* Team Collaboration Badge */}
        <div className="team-collab-badge" title="Frontend built with Liquid Glass UI for Backend Integration">
          <Code2 size={14} />
          <span>v1.0</span>
        </div>
      </div>
    </header>
  );
}
