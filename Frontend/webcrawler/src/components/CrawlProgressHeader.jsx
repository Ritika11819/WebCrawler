import React from 'react';
import { Activity, Clock, CheckCircle2, Zap, Layers, RefreshCw } from 'lucide-react';

export function CrawlProgressHeader({ crawlResult, isCrawling, progressPct }) {
  if (!isCrawling && !crawlResult) return null;

  return (
    <div className="crawl-progress-card-glass">
      <div className="progress-card-header">
        <div className="status-indicator">
          {isCrawling ? (
            <RefreshCw size={18} className="spinner-icon text-glow" />
          ) : (
            <CheckCircle2 size={18} className="success-icon" />
          )}
          <div>
            <span className="status-title">
              {isCrawling ? 'Crawling Web Frontier...' : 'Frontier Crawl Complete'}
            </span>
            <span className="status-seed">{crawlResult?.seedUrl || 'Initializing Seed URL...'}</span>
          </div>
        </div>

        <div className="live-metrics-strip">
          <div className="metric-chip">
            <Activity size={14} />
            <span>
              <strong>{crawlResult ? crawlResult.totalDiscovered : Math.floor((progressPct / 100) * 24)}</strong> Sub-URLs
            </span>
          </div>
          <div className="metric-chip">
            <Clock size={14} />
            <span>
              <strong>{crawlResult ? `${crawlResult.avgResponseTimeMs}ms` : '42ms'}</strong> Latency
            </span>
          </div>
          <div className="metric-chip accent">
            <Zap size={14} />
            <span>
              <strong>{crawlResult ? crawlResult.totalOccurrences.toLocaleString() : '1,840'}</strong> Total Hits
            </span>
          </div>
        </div>
      </div>

      {/* Liquid Animated Progress Bar */}
      <div className="liquid-progress-bar-wrap">
        <div
          className={`liquid-progress-fill ${isCrawling ? 'animating' : 'complete'}`}
          style={{ width: `${isCrawling ? progressPct : 100}%` }}
        >
          <div className="liquid-shine" />
        </div>
      </div>

      <div className="progress-footer-info">
        <span>
          {isCrawling
            ? `Parsing links & extracting sub-paths (${progressPct}%)`
            : `Indexed all sub-URLs residing under frontier URL at ${crawlResult?.crawledAt}`}
        </span>
        <span className="depth-tag">Max Depth: {crawlResult?.maxDepth || 2}</span>
      </div>
    </div>
  );
}
