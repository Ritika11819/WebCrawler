import React from 'react';
import { ExternalLink, Copy, Check, X, Globe, Layers, Clock, Shield, Hash, ArrowUpRight } from 'lucide-react';

export function UrlDetailDrawer({ link, onClose }) {
  const [copied, setCopied] = React.useState(false);

  if (!link) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(link.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="drawer-backdrop-glass" onClick={onClose}>
      <div className="drawer-panel-glass" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="drawer-title-wrap">
            <Globe className="text-accent" size={20} />
            <div>
              <h3 className="drawer-title">Sub-URL Inspection</h3>
              <span className="drawer-subtitle">{link.domain}</span>
            </div>
          </div>
          <button className="drawer-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="drawer-body">
          <div className="url-banner-card glass-card">
            <span className="banner-label">Full Target URL</span>
            <div className="url-copy-row">
              <code className="url-code-text">{link.url}</code>
              <button className="glass-icon-btn" onClick={handleCopy} title="Copy URL">
                {copied ? <Check size={16} className="text-emerald" /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          <div className="metrics-grid">
            <div className="drawer-metric-card glass-card">
              <span className="metric-num text-accent">{link.frequency.toLocaleString()}</span>
              <span className="metric-lbl">Usage Frequency</span>
            </div>

            <div className="drawer-metric-card glass-card">
              <span className="metric-num">Depth {link.depth}</span>
              <span className="metric-lbl">Frontier Level</span>
            </div>

            <div className="drawer-metric-card glass-card">
              <span className={`metric-num ${link.statusCode === 200 ? 'text-emerald' : 'text-amber'}`}>
                {link.statusCode}
              </span>
              <span className="metric-lbl">HTTP Status</span>
            </div>

            <div className="drawer-metric-card glass-card">
              <span className="metric-num">{link.responseTimeMs} ms</span>
              <span className="metric-lbl">Response Time</span>
            </div>
          </div>

          <div className="details-list-glass glass-card">
            <div className="detail-item">
              <span className="detail-label">Relative Path</span>
              <span className="detail-value font-mono">{link.path}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Parent Frontier URL</span>
              <span className="detail-value font-mono">{link.parentUrl}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Content Type</span>
              <span className="detail-value">{link.contentType}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Extracted Anchor Text</span>
              <span className="detail-value">{link.anchorText || 'N/A'}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Payload Size</span>
              <span className="detail-value">{link.sizeKb} KB</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Crawled At</span>
              <span className="detail-value">{new Date(link.lastCrawledAt).toLocaleString()}</span>
            </div>
          </div>

          <div className="drawer-actions">
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="open-url-btn glass-btn-primary"
            >
              <span>Visit Sub-URL in Browser</span>
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
