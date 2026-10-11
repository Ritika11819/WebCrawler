import React, { useState } from 'react';
import { Search, Globe, ArrowRight, Zap, SlidersHorizontal, RefreshCw, CheckCircle2, ShieldCheck } from 'lucide-react';

const PRESET_SEEDS = [
  { name: 'GitHub', url: 'https://github.com', category: 'Dev' },
  { name: 'Wikipedia', url: 'https://wikipedia.org', category: 'Knowledge' },
  { name: 'HackerNews', url: 'https://news.ycombinator.com', category: 'Tech' },
  { name: 'MDN Web Docs', url: 'https://developer.mozilla.org', category: 'Docs' },
  { name: 'StackOverflow', url: 'https://stackoverflow.com', category: 'Q&A' },
  { name: 'TechCrunch', url: 'https://techcrunch.com', category: 'News' },
];

export function FrontierSearchBar({
  urlQuery,
  onUrlQueryChange,
  onStartCrawl,
  isCrawling,
  crawlDepth,
  onChangeDepth,
}) {
  const [showOptions, setShowOptions] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!urlQuery.trim()) {
      setValidationError('Please enter a valid frontier seed URL (e.g. https://github.com)');
      return;
    }
    setValidationError('');
    onStartCrawl(urlQuery, crawlDepth);
  };

  const handleSelectPreset = (presetUrl) => {
    onUrlQueryChange(presetUrl);
    setValidationError('');
    onStartCrawl(presetUrl, crawlDepth);
  };

  return (
    <div className="search-section-container">
      {/* Hero Headline */}
      <div className="hero-text-block">
        <div className="hero-badge-glass">
          <Zap size={14} className="badge-icon-glow" />
          <span>SearchGenie Crawler Engine</span>
        </div>
        <h1 className="hero-title">
          Explore the <em>Frontier.</em> Map Every Link.
        </h1>
        <p className="hero-subtitle">
          Enter any root URL below. SearchGenie crawls the web frontier, extracts all sub-urls residing under it,
          and tracks link usage frequency in real time.
        </p>
      </div>

      {/* Main Spotlight Search Bar */}
      <form className={`frontier-search-bar-glass ${isCrawling ? 'crawling-active' : ''}`} onSubmit={handleSubmit}>
        <div className="search-icon-wrap">
          <Globe className="search-globe-icon" size={22} />
        </div>

        <div className="search-input-wrap">
          <input
            type="text"
            className="frontier-url-input"
            value={urlQuery}
            onChange={(e) => {
              onUrlQueryChange(e.target.value);
              if (validationError) setValidationError('');
            }}
            placeholder="Paste or type Frontier Seed URL (e.g., https://github.com)..."
            aria-label="Frontier Seed URL"
            disabled={isCrawling}
          />
        </div>

        {/* Depth & Advanced Options Toggle */}
        <button
          type="button"
          className={`search-options-btn ${showOptions ? 'active' : ''}`}
          onClick={() => setShowOptions(!showOptions)}
          title="Crawler Depth & Speed Controls"
        >
          <SlidersHorizontal size={18} />
          <span className="depth-badge">Depth {crawlDepth}</span>
        </button>

        {/* Crawl Action Button */}
        <button
          type="submit"
          className={`start-crawl-btn ${isCrawling ? 'loading' : ''}`}
          disabled={isCrawling}
        >
          {isCrawling ? (
            <>
              <RefreshCw size={18} className="spinner-icon" />
              <span>Crawling Frontier...</span>
            </>
          ) : (
            <>
              <span>Crawl Frontier</span>
              <ArrowRight size={18} className="btn-arrow" />
            </>
          )}
        </button>
      </form>

      {validationError && (
        <div className="validation-error-glass">
          <span>{validationError}</span>
        </div>
      )}

      {/* Advanced Crawl Options Drawer */}
      {showOptions && (
        <div className="advanced-options-glass glass-card-interactive">
          <div className="options-title">
            <span>Frontier Crawling Parameters</span>
            <span className="options-subtitle">Customize traversal depth for sub-URL discovery</span>
          </div>

          <div className="depth-selector-grid">
            {[
              { level: 1, label: 'Depth 1 (Direct Subpages)', desc: 'Fast (~15-25 sub-urls under root path)' },
              { level: 2, label: 'Depth 2 (Subpages + 2nd Tier)', desc: 'Recommended (~40-80 URLs, detailed hierarchy)' },
              { level: 3, label: 'Depth 3 (Deep Frontier Crawl)', desc: 'Deep traversal (~150+ sub-urls)' },
            ].map((item) => (
              <button
                key={item.level}
                type="button"
                className={`depth-option-card ${crawlDepth === item.level ? 'selected' : ''}`}
                onClick={() => onChangeDepth(item.level)}
              >
                <div className="depth-card-header">
                  <span className="depth-level">Level {item.level}</span>
                  {crawlDepth === item.level && <CheckCircle2 size={16} className="check-icon" />}
                </div>
                <div className="depth-card-title">{item.label}</div>
                <div className="depth-card-desc">{item.desc}</div>
              </button>
            ))}
          </div>

          <div className="options-footer">
            <span className="footer-tip">
              <ShieldCheck size={14} /> Respects robots.txt politeness policies and deduplicates Frontier URL queues.
            </span>
          </div>
        </div>
      )}

      {/* Preset Seed Shortcuts */}
      <div className="preset-seeds-container">
        <span className="preset-label">Try a Frontier Seed:</span>
        <div className="preset-chips-scroll">
          {PRESET_SEEDS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              className="preset-chip-glass"
              onClick={() => handleSelectPreset(preset.url)}
            >
              <Globe size={13} className="chip-globe" />
              <span className="chip-name">{preset.name}</span>
              <span className="chip-cat">{preset.category}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
