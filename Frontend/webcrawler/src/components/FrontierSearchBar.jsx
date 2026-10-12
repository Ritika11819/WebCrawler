import React, { useState } from 'react';
import { Search, Globe, X, SlidersHorizontal, ArrowRight, Sparkles, RefreshCw, CheckCircle2, Flame, Compass } from 'lucide-react';
import searchGenieLogo from '../assets/logo.png';

const POPULAR_SEEDS = [
  { name: 'GitHub', url: 'https://github.com' },
  { name: 'Wikipedia', url: 'https://wikipedia.org' },
  { name: 'Hacker News', url: 'https://news.ycombinator.com' },
  { name: 'MDN Docs', url: 'https://developer.mozilla.org' },
  { name: 'Stack Overflow', url: 'https://stackoverflow.com' },
];

export function FrontierSearchBar({
  urlQuery,
  onUrlQueryChange,
  onStartCrawl,
  isCrawling,
  crawlDepth,
  onChangeDepth,
  shortcuts = [],
  onCrawlShortcut,
}) {
  const [showOptions, setShowOptions] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!urlQuery.trim()) {
      setValidationError('Please enter a URL to crawl (e.g., https://github.com)');
      return;
    }
    setValidationError('');
    onStartCrawl(urlQuery, crawlDepth);
  };

  const handleLucky = () => {
    const random = POPULAR_SEEDS[Math.floor(Math.random() * POPULAR_SEEDS.length)].url;
    onUrlQueryChange(random);
    setValidationError('');
    onStartCrawl(random, crawlDepth);
  };

  const handleSelectSeed = (url) => {
    onUrlQueryChange(url);
    setValidationError('');
    onStartCrawl(url, crawlDepth);
  };

  const topShortcuts = [...shortcuts]
    .sort((a, b) => (b.frequency || 0) - (a.frequency || 0))
    .slice(0, 6);

  return (
    <div className="google-search-center-container">
      {/* Centered Logo */}
      <div className="google-logo-wrapper">
        <div className="logo-liquid-backdrop" />
        <img src={searchGenieLogo} alt="SearchGenie" className="google-center-logo" />
        <div className="logo-sparkle-pill">
          <Sparkles size={12} className="sparkle-icon" />
          <span>Web Intelligence Engine</span>
        </div>
      </div>

      {/* Search Bar */}
      <form className={`google-search-bar-glass ${isCrawling ? 'crawling-active' : ''}`} onSubmit={handleSubmit}>
        <div className="search-bar-prefix-icon">
          <Search size={20} className="search-icon-svg" />
        </div>
        <div className="search-input-flex-wrap">
          <input
            type="text"
            className="google-search-input"
            value={urlQuery}
            onChange={(e) => { onUrlQueryChange(e.target.value); if (validationError) setValidationError(''); }}
            placeholder="Enter a URL to explore (e.g., https://github.com)"
            aria-label="URL to crawl"
            disabled={isCrawling}
            autoComplete="off"
            spellCheck="false"
          />
        </div>

        {urlQuery && !isCrawling && (
          <button type="button" className="search-clear-btn" onClick={() => onUrlQueryChange('')} title="Clear">
            <X size={16} />
          </button>
        )}

        <button
          type="button"
          className={`search-depth-pill-btn ${showOptions ? 'active' : ''}`}
          onClick={() => setShowOptions(!showOptions)}
          title="Crawl depth"
        >
          <SlidersHorizontal size={15} />
          <span className="depth-label">Depth {crawlDepth}</span>
        </button>

        <button
          type="submit"
          className={`google-search-submit-btn ${isCrawling ? 'loading' : ''}`}
          disabled={isCrawling}
          title="Start crawl"
        >
          {isCrawling ? <RefreshCw size={17} className="spinner-icon" /> : <ArrowRight size={17} />}
        </button>
      </form>

      {validationError && (
        <div className="validation-error-glass"><span>{validationError}</span></div>
      )}

      {/* Depth Options */}
      {showOptions && (
        <div className="advanced-options-glass apple-liquid-modal">
          <div className="options-title-row">
            <span className="options-title">Crawl Depth</span>
            <span className="options-subtitle">How many link hops to follow</span>
          </div>
          <div className="depth-selector-grid">
            {[
              { level: 1, label: 'Depth 1 — Direct links', desc: 'Fast, surface-level crawl' },
              { level: 2, label: 'Depth 2 — Standard', desc: 'Recommended for most sites' },
              { level: 3, label: 'Depth 3 — Deep crawl', desc: 'Comprehensive multi-hop' },
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
        </div>
      )}

      {/* Action Buttons */}
      <div className="google-action-buttons-row">
        <button
          type="button"
          className="google-action-btn primary-glass-btn"
          onClick={() => handleSubmit()}
          disabled={isCrawling}
        >
          {isCrawling ? (
            <><RefreshCw size={15} className="spinner-icon" /><span>Crawling...</span></>
          ) : (
            <><Search size={15} /><span>Search</span></>
          )}
        </button>
        <button
          type="button"
          className="google-action-btn secondary-glass-btn"
          onClick={handleLucky}
          disabled={isCrawling}
          title="Crawl a random popular site"
        >
          <Compass size={15} />
          <span>I'm Feeling Lucky</span>
        </button>
      </div>

      {/* Shortcuts Grid */}
      {topShortcuts.length > 0 && (
        <div className="google-shortcuts-section">
          <div className="shortcuts-strip-header">
            <Flame size={14} className="flame-icon-glow" />
            <span>Frequently Visited</span>
          </div>
          <div className="google-shortcuts-grid">
            {topShortcuts.map((item) => (
              <button
                key={item.id || item.domain}
                type="button"
                className="google-shortcut-tile-glass"
                onClick={() => onCrawlShortcut(item.frontierUrl)}
                title={item.domain}
              >
                <div className="shortcut-icon-circle">
                  <span className="shortcut-avatar-letter">{item.title.charAt(0)}</span>
                  {item.frequency > 0 && (
                    <span className="shortcut-freq-pill">{item.frequency}</span>
                  )}
                </div>
                <span className="shortcut-tile-title">{item.title}</span>
                <span className="shortcut-tile-domain">{item.domain}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Popular Sites */}
      <div className="google-seed-presets-wrap">
        <span className="presets-label">Popular:</span>
        <div className="presets-chip-row">
          {POPULAR_SEEDS.map((seed) => (
            <button
              key={seed.name}
              type="button"
              className="preset-chip-apple-glass"
              onClick={() => handleSelectSeed(seed.url)}
            >
              <Globe size={12} className="preset-globe" />
              <span>{seed.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
