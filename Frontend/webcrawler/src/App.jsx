import React, { useState, useEffect } from 'react';
import { WallpaperBackground, WALLPAPERS } from './components/WallpaperBackground';
import { Header } from './components/Header';
import { FrontierSearchBar } from './components/FrontierSearchBar';
import { UrlShortcutsGrid } from './components/UrlShortcutsGrid';
import { CrawlProgressHeader } from './components/CrawlProgressHeader';
import { UrlFrontierResults } from './components/UrlFrontierResults';
import { BackendConfigModal } from './components/BackendConfigModal';
import { CrawlerGuideModal } from './components/CrawlerGuideModal';
import { UrlDetailDrawer } from './components/UrlDetailDrawer';
import {
  getStoredShortcuts,
  updateShortcutFrequency,
  getStoredBackendConfig,
  executeCrawlRequest,
  generateFrontierCrawlResults
} from './services/crawlerService';
import './App.css';

function App() {
  // Wallpaper state
  const [wallpaperIndex, setWallpaperIndex] = useState(0);
  const [isWallpaperPaused, setIsWallpaperPaused] = useState(false);

  // App navigation & crawl state
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'shortcuts', 'tree', 'analytics'
  const [urlQuery, setUrlQuery] = useState('https://github.com');
  const [crawlDepth, setCrawlDepth] = useState(2);
  const [isCrawling, setIsCrawling] = useState(false);
  const [progressPct, setProgressPct] = useState(0);
  const [crawlResult, setCrawlResult] = useState(null);

  // Shortcuts state
  const [shortcuts, setShortcuts] = useState(getStoredShortcuts());

  // Backend config & modals
  const [backendConfig, setBackendConfig] = useState(getStoredBackendConfig());
  const [isBackendModalOpen, setIsBackendModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [selectedLinkDetail, setSelectedLinkDetail] = useState(null);

  // Initial crawl load on startup so page is instantly vibrant
  useEffect(() => {
    const initialResult = generateFrontierCrawlResults('https://github.com', 2);
    setCrawlResult(initialResult);
  }, []);

  // Crawl execution handler
  const handleStartCrawl = async (targetUrl, depth = crawlDepth) => {
    if (!targetUrl || isCrawling) return;

    setIsCrawling(true);
    setProgressPct(10);

    // Update shortcuts frequency on front page
    const updatedShortcuts = updateShortcutFrequency(targetUrl);
    setShortcuts(updatedShortcuts);

    // Simulate progressive streaming progress
    const progressTimer = setInterval(() => {
      setProgressPct((prev) => {
        if (prev >= 90) {
          clearInterval(progressTimer);
          return 90;
        }
        return prev + Math.floor(Math.random() * 20) + 10;
      });
    }, 180);

    try {
      const result = await executeCrawlRequest(targetUrl, { depth: depth });
      clearInterval(progressTimer);
      setProgressPct(100);

      setTimeout(() => {
        setCrawlResult(result.data);
        setIsCrawling(false);
      }, 300);
    } catch (err) {
      clearInterval(progressTimer);
      setIsCrawling(false);
      console.error('Crawl execution failed', err);
    }
  };

  const handleCrawlShortcut = (frontierUrl) => {
    setUrlQuery(frontierUrl);
    setActiveTab('overview');
    handleStartCrawl(frontierUrl, crawlDepth);
  };

  return (
    <div className="app-root-shell">
      {/* Continuous Wallpaper Background with Liquid Light */}
      <WallpaperBackground
        currentIndex={wallpaperIndex}
        onIndexChange={setWallpaperIndex}
        isPaused={isWallpaperPaused}
        onTogglePause={() => setIsWallpaperPaused(!isWallpaperPaused)}
        intervalSeconds={7}
      />

      {/* Main Glass Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isBackendConnected={backendConfig.useRealBackend}
        useRealBackend={backendConfig.useRealBackend}
        onOpenBackendConfig={() => setIsBackendModalOpen(true)}
        onOpenGuide={() => setIsGuideModalOpen(true)}
        wallpaperIndex={wallpaperIndex}
      />

      {/* Main Content Area */}
      <main className="main-content-layout">
        {/* Frontier Search Bar Section */}
        <FrontierSearchBar
          urlQuery={urlQuery}
          onUrlQueryChange={setUrlQuery}
          onStartCrawl={handleStartCrawl}
          isCrawling={isCrawling}
          crawlDepth={crawlDepth}
          onChangeDepth={setCrawlDepth}
        />

        {/* Live Crawl Progress Bar & Metrics */}
        <CrawlProgressHeader
          crawlResult={crawlResult}
          isCrawling={isCrawling}
          progressPct={progressPct}
        />

        {/* TAB 1: Overview - Front Page Shortcuts & Discovered URLs */}
        {activeTab === 'overview' && (
          <>
            {/* Frequency-based Front Page Shortcuts */}
            <UrlShortcutsGrid
              shortcuts={shortcuts}
              onSelectShortcut={(s) => setUrlQuery(s.frontierUrl)}
              onCrawlShortcut={handleCrawlShortcut}
            />

            {/* Discovered Sub-URLs List / Results */}
            <UrlFrontierResults
              crawlResult={crawlResult}
              onSelectLinkDetail={setSelectedLinkDetail}
            />
          </>
        )}

        {/* TAB 2: Shortcuts Dedicated View */}
        {activeTab === 'shortcuts' && (
          <div className="tab-view-container">
            <UrlShortcutsGrid
              shortcuts={shortcuts}
              onSelectShortcut={(s) => setUrlQuery(s.frontierUrl)}
              onCrawlShortcut={handleCrawlShortcut}
            />
          </div>
        )}

        {/* TAB 3: Tree View Dedicated */}
        {activeTab === 'tree' && (
          <div className="tab-view-container">
            <UrlFrontierResults
              crawlResult={crawlResult}
              onSelectLinkDetail={setSelectedLinkDetail}
            />
          </div>
        )}

        {/* TAB 4: Analytics View Dedicated */}
        {activeTab === 'analytics' && (
          <div className="tab-view-container">
            <UrlFrontierResults
              crawlResult={crawlResult}
              onSelectLinkDetail={setSelectedLinkDetail}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer-glass">
        <div className="footer-left">
          <span>SearchGenie &copy; {new Date().getFullYear()}</span>
          <span className="dot-divider">•</span>
          <span>Web Crawler Frontier Engine</span>
        </div>
        <div className="footer-right">
          <span className="live-status-pill">
            <i className="status-dot-green" /> Operational
          </span>
          <button className="footer-link-btn" onClick={() => setIsGuideModalOpen(true)}>
            Architecture Guide
          </button>
          <button className="footer-link-btn" onClick={() => setIsBackendModalOpen(true)}>
            API Config
          </button>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <BackendConfigModal
        isOpen={isBackendModalOpen}
        onClose={() => setIsBackendModalOpen(false)}
        onConfigSaved={setBackendConfig}
      />

      <CrawlerGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />

      <UrlDetailDrawer
        link={selectedLinkDetail}
        onClose={() => setSelectedLinkDetail(null)}
      />
    </div>
  );
}

export default App;
