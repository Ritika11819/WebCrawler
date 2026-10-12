import React from 'react';
import { TrendingUp, ArrowUpRight, Flame, Clock, Play } from 'lucide-react';

export function UrlShortcutsGrid({ shortcuts, onSelectShortcut, onCrawlShortcut }) {
  const sortedShortcuts = [...shortcuts].sort((a, b) => (b.frequency || 0) - (a.frequency || 0));

  return (
    <section className="shortcuts-section">
      <div className="shortcuts-header-bar apple-glass-header">
        <div className="title-with-badge">
          <div className="icon-wrap-glass">
            <Flame size={18} className="flame-icon" />
          </div>
          <div>
            <h2 className="section-title">Frequently Visited Shortcuts</h2>
            <p className="section-subtitle">Ranked by search and crawl frequency</p>
          </div>
        </div>
      </div>

      {sortedShortcuts.length > 0 ? (
        <div className="shortcuts-grid">
          {sortedShortcuts.slice(0, 8).map((item, index) => {
            const rank = index + 1;
            const isTopThree = rank <= 3;

            return (
              <div
                key={item.id || item.domain}
                className={`shortcut-card-apple-glass ${isTopThree ? 'top-ranked' : ''}`}
              >
                <div className="card-liquid-specular" />

                <div className="card-top">
                  <div className={`site-avatar-apple ${item.color || 'blue'}`}>
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

                <div className="shortcut-metrics-row">
                  <div className="metric-box">
                    <span className="metric-value">{(item.frequency || 0).toLocaleString()}</span>
                    <span className="metric-label">Hits</span>
                  </div>
                  <div className="metric-box">
                    <span className="metric-value">{item.visitCount || 1}</span>
                    <span className="metric-label">Visits</span>
                  </div>
                  <div className="metric-box">
                    <span className="metric-value text-accent">{item.discoveredCount || 0}</span>
                    <span className="metric-label">Neighbours</span>
                  </div>
                </div>

                <div className="shortcut-actions-row">
                  <button
                    className="shortcut-crawl-btn apple-glass-btn-primary"
                    onClick={() => onCrawlShortcut(item.frontierUrl)}
                    title={`Crawl ${item.domain}`}
                  >
                    <Play size={13} />
                    <span>Search</span>
                  </button>

                  <a
                    href={item.frontierUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shortcut-visit-btn apple-glass-btn-icon"
                    title={`Open ${item.domain}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ArrowUpRight size={15} />
                  </a>
                </div>

                <div className="card-footer-info">
                  <Clock size={11} />
                  <span>Source: {item.lastCrawled || 'MongoDB Database'}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-results-glass" style={{ margin: '2rem auto', maxWidth: '600px', textAlign: 'center' }}>
          <Flame size={24} className="flame-icon" />
          <span>No shortcuts found in database yet</span>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Search a seed URL above to query its neighbours from the database and build shortcuts.
          </p>
        </div>
      )}
    </section>
  );
}
