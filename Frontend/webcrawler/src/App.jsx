import React, { useState, useEffect } from 'react';
import { WallpaperBackground } from './components/WallpaperBackground';
import { Header } from './components/Header';
import { FrontierSearchBar } from './components/FrontierSearchBar';
import { UrlShortcutsGrid } from './components/UrlShortcutsGrid';
import { CrawlProgressHeader } from './components/CrawlProgressHeader';
import { UrlFrontierResults } from './components/UrlFrontierResults';
import { UrlDetailDrawer } from './components/UrlDetailDrawer';
import {
  executeCrawlRequest,
  fetchShortcutsFromBackend,
} from './services/crawlerService';
import './App.css';

function App() {
  const [wallpaperIndex, setWallpaperIndex] = useState(0);
  const [isWallpaperPaused, setIsWallpaperPaused] = useState(false);

  const [activeTab, setActiveTab] = useState('overview');
  const [urlQuery, setUrlQuery] = useState('');
  const [crawlDepth, setCrawlDepth] = useState(2);
  const [isCrawling, setIsCrawling] = useState(false);
  const [progressPct, setProgressPct] = useState(0);
  const [crawlResult, setCrawlResult] = useState(null);

  const [shortcuts, setShortcuts] = useState([]);
  const [selectedLinkDetail, setSelectedLinkDetail] = useState(null);

  const loadShortcuts = async () => {
    try {
      const backendShortcuts = await fetchShortcutsFromBackend();
      if (backendShortcuts && backendShortcuts.length > 0) {
        setShortcuts(backendShortcuts);
      }
    } catch (e) {
      console.warn('Could not load shortcuts from backend database', e);
    }
  };

  useEffect(() => {
    // Load shortcuts from backend database /shortcuts endpoint
    loadShortcuts();
  }, []);

  const handleStartCrawl = async (targetUrl, depth = crawlDepth) => {
    if (!targetUrl || isCrawling) return;

    setIsCrawling(true);
    setProgressPct(15);

    const progressTimer = setInterval(() => {
      setProgressPct((prev) => {
        if (prev >= 90) { clearInterval(progressTimer); return 90; }
        return prev + 15;
      });
    }, 120);

    try {
      const result = await executeCrawlRequest(targetUrl, { depth });
      clearInterval(progressTimer);
      setProgressPct(100);
      setTimeout(() => {
        setCrawlResult(result.data);
        setIsCrawling(false);
        setActiveTab('overview');
      }, 200);

      // Refresh shortcuts from backend /shortcuts database endpoint
      loadShortcuts();
    } catch (err) {
      clearInterval(progressTimer);
      setIsCrawling(false);
      console.error('Crawl failed:', err);
    }
  };

  const handleCrawlShortcut = (frontierUrl) => {
    setUrlQuery(frontierUrl);
    handleStartCrawl(frontierUrl, crawlDepth);
  };

  return (
    <div className="app-root-shell">
      <WallpaperBackground
        currentIndex={wallpaperIndex}
        onIndexChange={setWallpaperIndex}
        isPaused={isWallpaperPaused}
        onTogglePause={() => setIsWallpaperPaused(!isWallpaperPaused)}
        intervalSeconds={7}
      />

      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="main-content-layout">
        <FrontierSearchBar
          urlQuery={urlQuery}
          onUrlQueryChange={setUrlQuery}
          onStartCrawl={handleStartCrawl}
          isCrawling={isCrawling}
          crawlDepth={crawlDepth}
          onChangeDepth={setCrawlDepth}
          shortcuts={shortcuts}
          onCrawlShortcut={handleCrawlShortcut}
        />

        <CrawlProgressHeader
          crawlResult={crawlResult}
          isCrawling={isCrawling}
          progressPct={progressPct}
        />

        {activeTab === 'overview' && (
          <div className="tab-view-container">
            <UrlFrontierResults
              crawlResult={crawlResult}
              onSelectLinkDetail={setSelectedLinkDetail}
            />
          </div>
        )}

        {activeTab === 'shortcuts' && (
          <div className="tab-view-container">
            <UrlShortcutsGrid
              shortcuts={shortcuts}
              onSelectShortcut={(s) => setUrlQuery(s.frontierUrl)}
              onCrawlShortcut={handleCrawlShortcut}
            />
          </div>
        )}

        {activeTab === 'tree' && (
          <div className="tab-view-container">
            <UrlFrontierResults crawlResult={crawlResult} onSelectLinkDetail={setSelectedLinkDetail} />
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="tab-view-container">
            <UrlFrontierResults crawlResult={crawlResult} onSelectLinkDetail={setSelectedLinkDetail} />
          </div>
        )}
      </main>

      <footer className="footer-glass">
        <div className="footer-left">
          <span>SearchGenie &copy; {new Date().getFullYear()}</span>
          <span className="dot-divider">•</span>
          <span>Web Intelligence Engine</span>
        </div>
        <div className="footer-right">
          <span className="live-status-pill">
            <i className="status-dot-green" /> Operational
          </span>
        </div>
      </footer>

      <UrlDetailDrawer
        link={selectedLinkDetail}
        onClose={() => setSelectedLinkDetail(null)}
      />
    </div>
  );
}

export default App;
