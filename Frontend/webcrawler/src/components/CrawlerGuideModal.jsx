import React from 'react';
import { HelpCircle, Layers, Network, ShieldCheck, Cpu, Database, Flame, CheckCircle2 } from 'lucide-react';

export function CrawlerGuideModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop-glass" onClick={onClose}>
      <div className="modal-card-glass guide-modal-size" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <HelpCircle className="text-accent" size={22} />
            <div>
              <h3 className="modal-title">Web Crawler Architecture Guide</h3>
              <p className="modal-subtitle">How Frontier Queues & Sub-URL Frequency Indexing Work</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body guide-body-scroll">
          <div className="guide-hero-banner glass-card-interactive">
            <h4>What is a Web Crawler & Frontier URL?</h4>
            <p>
              A <strong>Web Crawler</strong> (or spider) is an automated system that starts at a <strong>Seed URL</strong> (the Frontier URL)
              and recursively fetches web pages, parses HTML content to extract all sub-links, and pushes new unvisited links into the URL Frontier Queue.
            </p>
          </div>

          <div className="guide-steps-grid">
            <div className="guide-step-card glass-card">
              <div className="step-icon-wrap">
                <Network size={20} />
              </div>
              <h5>1. Seed URL & Frontier Queue</h5>
              <p>
                The user inputs a root Frontier URL (e.g. <code>https://github.com</code>). This URL is enqueued into the Frontier FIFO Queue with Depth = 0.
              </p>
            </div>

            <div className="guide-step-card glass-card">
              <div className="step-icon-wrap">
                <Cpu size={20} />
              </div>
              <h5>2. HTML Fetching & Link Extraction</h5>
              <p>
                The crawler sends HTTP requests to the URL, receives the HTML response payload, and uses DOM parsers (or regex/BeautifulSoup) to harvest all <code>&lt;a href="..."&gt;</code> tags.
              </p>
            </div>

            <div className="guide-step-card glass-card">
              <div className="step-icon-wrap">
                <Database size={20} />
              </div>
              <h5>3. URL Normalization & Deduplication</h5>
              <p>
                Relative paths like <code>/about</code> are resolved into absolute URLs (<code>https://github.com/about</code>). A Seen Hash Set prevents infinite loops and redundant crawls.
              </p>
            </div>

            <div className="guide-step-card glass-card">
              <div className="step-icon-wrap">
                <Flame size={20} />
              </div>
              <h5>4. Usage Frequency & Shortcuts</h5>
              <p>
                Every discovered sub-URL accumulates hit occurrences. High-frequency sub-URLs are surfaced on the front page as shortcuts for instant quick access!
              </p>
            </div>
          </div>

          <div className="guide-backend-tip glass-card">
            <ShieldCheck size={18} className="text-emerald" />
            <div>
              <strong>For your Team Workflow:</strong>
              <p>
                Since your friend is building the backend in Python (FastAPI/Flask/Scrapy) or Node.js/Go, they will handle the HTTP client & HTML parsing pipeline.
                SearchGenie's liquid glass frontend handles interactive search, frequency analytics, graph rendering, and shortcut persistence.
              </p>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="save-btn glass-btn-primary" onClick={onClose}>
            Got it, Let's Crawl!
          </button>
        </div>
      </div>
    </div>
  );
}
