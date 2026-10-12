import React from 'react';
import { Globe, Layers, Network, BarChart3 } from 'lucide-react';
import searchGenieLogo from '../assets/logo.png';

export function Header({ activeTab, onTabChange }) {
  return (
    <header className="header-glass">
      <div className="header-left">
        <a href="/" className="brand-link" onClick={(e) => { e.preventDefault(); onTabChange('overview'); }}>
          <div className="brand-logo-frame">
            <img src={searchGenieLogo} alt="SearchGenie" className="brand-logo-img" />
            <div className="brand-logo-glow" />
          </div>
          <div className="brand-title-wrap">
            <span className="brand-name">SearchGenie</span>
            <span className="brand-tagline">Web Intelligence Engine</span>
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
            <span>Search</span>
          </button>
          <button
            className={`nav-item-btn ${activeTab === 'shortcuts' ? 'active' : ''}`}
            onClick={() => onTabChange('shortcuts')}
          >
            <Layers size={15} />
            <span>Shortcuts</span>
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
            <span>Analytics</span>
          </button>
        </div>
      </nav>

      <div className="header-right">
        <span className="live-status-pill-header">
          <i className="status-dot-green" /> Live
        </span>
      </div>
    </header>
  );
}
