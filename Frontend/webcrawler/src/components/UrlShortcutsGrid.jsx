import React from 'react';
import { Layers, TrendingUp, ExternalLink, ArrowUpRight, Flame, Clock, Play } from 'lucide-react';

export function UrlShortcutsGrid({ shortcuts, onSelectShortcut, onCrawlShortcut }) {
  // Sort by usage frequency descending
  const sortedShortcuts = [...shortcuts].sort((a, b) => b.frequency - a.frequency);

  return (
    <section className="shortcuts-section">
      <div className="shortcuts-header-bar">
        <div className="title-with-badge">
          <div className="icon-wrap-glass">
            <Flame size={18} className="flame-icon" />
          </div>
          <div>
            <h2 className="section-title">Front Page URL Shortcuts</h2>
            <p className="section-subtitle">Top URLs ranked dynamically by frequency of usage and crawl hits</p>
          </div>
        </div>

        <div className="frequency-legend">
          <span className="legend-dot" />
          <span>Calculated by Frontier Frequency Engine</span>
        </div>
      </div>

      <div className="shortcuts-grid">
        {sortedShortcuts.slice(0, 6).map((item, index) => {
          const rank = index + 1;
          const isTopThree = rank <= 3;

          return (
            <div
              key={item.id || item.domain}
              className={`shortcut-card-glass ${isTopThree ? 'top-ranked' : ''}`}
            >
              {/* Card Glass Specular Highlight */}
              <div className="card-glass-glow" />

              <div className="card-top">
                <div className={`site-avatar-glass ${item.color || 'blue'}`}>
                  <span>{item.title.charAt(0)}</span>
                </div>

                <div className="rank-badge-pill">
                  <TrendingUp size={12} />
                  <span>#{rank} Popular</span>
                </div>
              </div>

              <div className="card-body">
                <h3 className="shortcut-title">{item.title}</h3>
                <span className="shortcut-domain">{item.domain}</span>
                <span className="shortcut-sample-path">{item.samplePath || '/'}</span>
              </div>

              {/* Frequency Stats Row */}
              <div className="shortcut-metrics-row">
                <div className="metric-box">
                  <span className="metric-value">{item.frequency.toLocaleString()}</span>
                  <span className="metric-label">Frontier Hits</span>
                </div>
                <div className="metric-box">
                  <span className="metric-value">{item.visitCount || 42}</span>
                  <span className="metric-label">Crawls</span>
                </div>
                <div className="metric-box">
                  <span className="metric-value text-accent">{item.discoveredCount || 820}</span>
                  <span className="metric-label">Sub-URLs</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="shortcut-actions-row">
                <button
                  className="shortcut-crawl-btn glass-btn"
                  onClick={() => onCrawlShortcut(item.frontierUrl)}
                  title={`Crawl all sub-urls under ${item.domain}`}
                >
                  <Play size={14} />
                  <span>Crawl Seed</span>
                </button>

                <a
                  href={item.frontierUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shortcut-visit-btn glass-btn-icon"
                  title={`Visit ${item.domain} in new tab`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <ArrowUpRight size={16} />
                </a>
              </div>

              <div className="card-footer-info">
                <Clock size={11} />
                <span>Last crawled: {item.lastCrawled || 'Recently'}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
