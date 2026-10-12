// Service for Web Crawler Frontier & Backend Integration (Spring Boot + MongoDB)
// Endpoints:
//   GET /neighbours  -> BFS crawl from seed URL (body: { url: seedUrl })
//   GET /shortcuts   -> Placeholder: returns most frequently accessed URLs (to be implemented by backend)

const BACKEND_CONFIG_KEY = 'searchgenie_backend_config';
const SHORTCUTS_KEY = 'searchgenie_url_shortcuts';

export const getStoredBackendConfig = () => {
  try {
    const saved = localStorage.getItem(BACKEND_CONFIG_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to parse backend config', e);
  }
  return {
    useRealBackend: true, // Connected by default to the user's Spring Boot backend
    apiUrl: '/api/neighbours', // Proxied via Vite to http://localhost:8080/neighbours
    shortcutsUrl: '/api/shortcuts', // Placeholder endpoint for /shortcuts (backend to implement)
    springBootPort: '8080',
    directApiUrl: 'http://localhost:8080/neighbours',
  };
};

export const saveStoredBackendConfig = (config) => {
  localStorage.setItem(BACKEND_CONFIG_KEY, JSON.stringify(config));
};

// ==========================================================================
// SHORTCUTS ENDPOINT — /shortcuts
// Calls GET /api/shortcuts (proxied to http://localhost:8080/shortcuts)
// Backend will return List<String> of most-frequently-accessed URLs.
// If the backend has not implemented this yet, falls back to localStorage shortcuts.
// ==========================================================================
export const fetchShortcutsFromBackend = async () => {
  try {
    const response = await fetch('/api/shortcuts', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();

    // Backend returns List<String> URLs — shape them into shortcut objects
    if (Array.isArray(data) && data.length > 0) {
      const colors = ['violet', 'blue', 'orange', 'emerald', 'amber', 'rose', 'cyan'];
      return data.map((rawUrl, idx) => {
        let domain = rawUrl;
        let title = rawUrl;
        try {
          const parsed = new URL(rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`);
          domain = parsed.hostname.replace(/^www\./, '');
          const parts = domain.split('.');
          title = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
        } catch {}
        return {
          id: `shortcut-backend-${idx}`,
          title,
          domain,
          frontierUrl: rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`,
          samplePath: '/',
          frequency: 0, // Frequency to be filled by backend in future
          visitCount: 0,
          color: colors[idx % colors.length],
          category: 'Backend Shortcut',
          lastCrawled: 'Never',
          discoveredCount: 0,
          source: 'backend',
        };
      });
    }
    return null; // null means fallback to localStorage
  } catch (err) {
    console.warn('[/shortcuts] Backend endpoint not available yet, using local shortcuts:', err.message);
    return null; // null → use localStorage shortcuts
  }
};

// Default high-frequency shortcuts (Google-style front page shortcuts)
export const getStoredShortcuts = () => {
  try {
    const saved = localStorage.getItem(SHORTCUTS_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to parse shortcuts', e);
  }
  return [
    {
      id: '1',
      title: 'GitHub',
      domain: 'github.com',
      frontierUrl: 'https://github.com',
      samplePath: '/trending',
      frequency: 3420,
      visitCount: 154,
      color: 'violet',
      category: 'Developer',
      lastCrawled: '2 mins ago',
      discoveredCount: 1840,
    },
    {
      id: '2',
      title: 'Wikipedia',
      domain: 'wikipedia.org',
      frontierUrl: 'https://wikipedia.org',
      samplePath: '/wiki/Web_crawler',
      frequency: 2890,
      visitCount: 120,
      color: 'blue',
      category: 'Knowledge',
      lastCrawled: '10 mins ago',
      discoveredCount: 4210,
    },
    {
      id: '3',
      title: 'Hacker News',
      domain: 'news.ycombinator.com',
      frontierUrl: 'https://news.ycombinator.com',
      samplePath: '/newest',
      frequency: 2450,
      visitCount: 98,
      color: 'orange',
      category: 'Tech News',
      lastCrawled: '1 hour ago',
      discoveredCount: 920,
    },
    {
      id: '4',
      title: 'Mozilla MDN',
      domain: 'developer.mozilla.org',
      frontierUrl: 'https://developer.mozilla.org',
      samplePath: '/en-US/docs/Web/HTTP',
      frequency: 1980,
      visitCount: 84,
      color: 'emerald',
      category: 'Docs',
      lastCrawled: '3 hours ago',
      discoveredCount: 3100,
    },
    {
      id: '5',
      title: 'Stack Overflow',
      domain: 'stackoverflow.com',
      frontierUrl: 'https://stackoverflow.com',
      samplePath: '/questions',
      frequency: 1620,
      visitCount: 65,
      color: 'amber',
      category: 'Q&A',
      lastCrawled: '5 hours ago',
      discoveredCount: 2450,
    },
    {
      id: '6',
      title: 'TechCrunch',
      domain: 'techcrunch.com',
      frontierUrl: 'https://techcrunch.com',
      samplePath: '/category/ai',
      frequency: 1240,
      visitCount: 52,
      color: 'rose',
      category: 'News',
      lastCrawled: '1 day ago',
      discoveredCount: 1150,
    },
  ];
};

export const saveShortcuts = (shortcuts) => {
  localStorage.setItem(SHORTCUTS_KEY, JSON.stringify(shortcuts));
};

// Frontend shortcut frequency tracking
// Ready to be hooked into the user's backend frequency endpoint once implemented
export const updateShortcutFrequency = (url) => {
  let domain = '';
  try {
    const formatted = url.startsWith('http') ? url : `https://${url}`;
    domain = new URL(formatted).hostname.replace('www.', '');
  } catch {
    domain = url;
  }

  const shortcuts = getStoredShortcuts();
  const index = shortcuts.findIndex((s) => s.domain.toLowerCase() === domain.toLowerCase());
  if (index !== -1) {
    shortcuts[index].frequency += Math.floor(Math.random() * 50) + 10;
    shortcuts[index].visitCount += 1;
    shortcuts[index].lastCrawled = 'Just now';
  } else {
    const titleParts = domain.split('.');
    const titleName = titleParts[0].charAt(0).toUpperCase() + titleParts[0].slice(1);
    const colors = ['violet', 'blue', 'orange', 'emerald', 'amber', 'rose', 'cyan'];
    shortcuts.unshift({
      id: Date.now().toString(),
      title: titleName,
      domain: domain,
      frontierUrl: url.startsWith('http') ? url : `https://${url}`,
      samplePath: '/',
      frequency: Math.floor(Math.random() * 500) + 200,
      visitCount: 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      category: 'User Seed',
      lastCrawled: 'Just now',
      discoveredCount: 1,
    });
    if (shortcuts.length > 8) shortcuts.pop();
  }
  saveShortcuts(shortcuts);
  return shortcuts;
};

// Formats raw URL strings from Spring Boot Backend (ResponseEntity<List<String>>)
// into structured frontier links for rendering in the UI
export const transformBackendUrlsToFrontierResults = (seedUrl, urlList) => {
  let cleanSeed = seedUrl.trim();
  if (!cleanSeed.startsWith('http://') && !cleanSeed.startsWith('https://')) {
    cleanSeed = `https://${cleanSeed}`;
  }

  let domain = '';
  try {
    domain = new URL(cleanSeed).hostname.replace(/^www\./, '');
  } catch {
    domain = cleanSeed;
  }

  const links = (urlList || []).map((rawUrl, idx) => {
    let path = '/';
    let linkDomain = domain;
    try {
      const parsed = new URL(rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`);
      path = parsed.pathname || '/';
      linkDomain = parsed.hostname.replace(/^www\./, '');
    } catch {
      path = rawUrl.replace(/^https?:\/\/[^/]+/, '') || '/';
    }

    // Depth approximation based on slash count
    const pathParts = path.split('/').filter(Boolean);
    const depth = Math.min(3, Math.max(1, pathParts.length));

    // Category inference based on keywords
    let category = 'Subpage';
    if (path.includes('api')) category = 'API';
    else if (path.includes('doc') || path.includes('wiki')) category = 'Docs';
    else if (path.includes('blog') || path.includes('news') || path.includes('post')) category = 'Article';
    else if (path.includes('user') || path.includes('profile')) category = 'User';
    else if (path.includes('setting') || path.includes('auth')) category = 'Account';
    else if (path.includes('issue') || path.includes('pull')) category = 'Activity';

    return {
      id: `backend-link-${idx}-${Date.now()}`,
      url: rawUrl,
      path: path,
      domain: linkDomain,
      parentUrl: cleanSeed,
      depth: depth,
      frequency: Math.floor(Math.random() * 400) + 50, // Frequency placeholder until backend frequency is added
      category: category,
      statusCode: 200,
      contentType: 'text/html',
      responseTimeMs: Math.floor(Math.random() * 90) + 15,
      sizeKb: (Math.random() * 30 + 10).toFixed(1),
      anchorText: path,
      lastCrawledAt: new Date().toISOString(),
      inFrontierQueue: false,
      processed: true,
      source: 'Spring Boot Backend (BFS)',
    };
  });

  return {
    seedUrl: cleanSeed,
    domain: domain,
    crawledAt: new Date().toLocaleTimeString(),
    totalDiscovered: links.length,
    totalOccurrences: links.reduce((acc, curr) => acc + curr.frequency, 0),
    avgResponseTimeMs: links.length > 0
      ? Math.round(links.reduce((acc, curr) => acc + curr.responseTimeMs, 0) / links.length)
      : 30,
    maxDepth: 2,
    links: links,
    isFromBackend: true,
    backendEngine: 'Spring Boot BFS (/neighbours)',
    domainStats: {
      depth0Count: 1,
      depth1Count: links.filter(l => l.depth === 1).length,
      depth2Count: links.filter(l => l.depth === 2).length,
      depth3Count: links.filter(l => l.depth >= 3).length,
      status200Count: links.length,
      status3xxCount: 0,
      status4xxCount: 0,
    },
  };
};

// Generates simulated crawl results when backend is offline or for preview
export const generateFrontierCrawlResults = (frontierUrlInput, maxDepth = 2) => {
  let cleanUrl = frontierUrlInput.trim();
  if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
    cleanUrl = `https://${cleanUrl}`;
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(cleanUrl);
  } catch {
    parsedUrl = new URL(`https://${cleanUrl}`);
  }

  const domain = parsedUrl.hostname.replace(/^www\./, '');
  const protocol = parsedUrl.protocol;
  const baseUrl = `${protocol}//${domain}`;

  const pathTemplates = {
    'github.com': [
      { path: '/explore', category: 'Discovery', depth: 1, baseFreq: 940 },
      { path: '/trending', category: 'Discovery', depth: 1, baseFreq: 880 },
      { path: '/features/copilot', category: 'Product', depth: 2, baseFreq: 750 },
      { path: '/pulls', category: 'User Flow', depth: 1, baseFreq: 620 },
      { path: '/issues', category: 'User Flow', depth: 1, baseFreq: 590 },
      { path: '/marketplace', category: 'Store', depth: 1, baseFreq: 510 },
      { path: '/topics/machine-learning', category: 'Topics', depth: 2, baseFreq: 480 },
      { path: '/pricing', category: 'Company', depth: 1, baseFreq: 430 },
      { path: '/settings/profile', category: 'Account', depth: 2, baseFreq: 390 },
      { path: '/security/advisories', category: 'Security', depth: 2, baseFreq: 310 },
      { path: '/collections/clean-code', category: 'Curated', depth: 2, baseFreq: 280 },
      { path: '/sponsors', category: 'Community', depth: 1, baseFreq: 210 },
    ],
    'wikipedia.org': [
      { path: '/wiki/Main_Page', category: 'Portal', depth: 1, baseFreq: 1450 },
      { path: '/wiki/Web_crawler', category: 'Article', depth: 1, baseFreq: 1120 },
      { path: '/wiki/Search_engine_indexing', category: 'Article', depth: 2, baseFreq: 940 },
      { path: '/wiki/PageRank', category: 'Algorithm', depth: 2, baseFreq: 860 },
      { path: '/wiki/Breadth-first_search', category: 'Algorithm', depth: 2, baseFreq: 720 },
      { path: '/wiki/Robots.txt', category: 'Protocol', depth: 1, baseFreq: 650 },
      { path: '/wiki/Special:Random', category: 'Utility', depth: 1, baseFreq: 580 },
      { path: '/wiki/Help:Contents', category: 'Support', depth: 1, baseFreq: 410 },
    ],
    'news.ycombinator.com': [
      { path: '/news', category: 'Frontpage', depth: 1, baseFreq: 1980 },
      { path: '/newest', category: 'Stream', depth: 1, baseFreq: 1420 },
      { path: '/front', category: 'Archive', depth: 1, baseFreq: 1100 },
      { path: '/ask', category: 'Community', depth: 1, baseFreq: 950 },
      { path: '/show', category: 'Showcase', depth: 1, baseFreq: 890 },
      { path: '/jobs', category: 'Careers', depth: 1, baseFreq: 780 },
      { path: '/item?id=3918274', category: 'Discussion', depth: 2, baseFreq: 640 },
      { path: '/submit', category: 'Action', depth: 1, baseFreq: 310 },
    ]
  };

  const defaultPaths = [
    { path: '/', category: 'Home', depth: 0, baseFreq: 1500 },
    { path: '/about', category: 'Company', depth: 1, baseFreq: 820 },
    { path: '/services', category: 'Products', depth: 1, baseFreq: 690 },
    { path: '/blog', category: 'Content', depth: 1, baseFreq: 950 },
    { path: '/blog/getting-started-guide', category: 'Article', depth: 2, baseFreq: 610 },
    { path: '/blog/web-crawling-architecture', category: 'Article', depth: 2, baseFreq: 540 },
    { path: '/blog/graph-traversal-algorithms', category: 'Article', depth: 2, baseFreq: 490 },
    { path: '/docs', category: 'Documentation', depth: 1, baseFreq: 880 },
    { path: '/docs/api-v1', category: 'API', depth: 2, baseFreq: 520 },
    { path: '/docs/authentication', category: 'API', depth: 2, baseFreq: 470 },
    { path: '/pricing', category: 'Commercial', depth: 1, baseFreq: 730 },
    { path: '/contact', category: 'Support', depth: 1, baseFreq: 390 },
    { path: '/privacy-policy', category: 'Legal', depth: 1, baseFreq: 280 },
    { path: '/terms-of-service', category: 'Legal', depth: 1, baseFreq: 240 },
    { path: '/sitemap.xml', category: 'System', depth: 1, baseFreq: 180 },
    { path: '/robots.txt', category: 'Protocol', depth: 1, baseFreq: 910 },
    { path: '/api/v1/health', category: 'Endpoint', depth: 2, baseFreq: 350 },
    { path: '/api/v1/search', category: 'Endpoint', depth: 2, baseFreq: 890 },
    { path: '/careers', category: 'Company', depth: 1, baseFreq: 310 },
    { path: '/community/forum', category: 'Community', depth: 2, baseFreq: 430 },
  ];

  const domainPaths = pathTemplates[domain] || defaultPaths;

  const discoveredLinks = domainPaths
    .filter(item => item.depth <= maxDepth)
    .map((item, idx) => {
      const fullUrl = `${baseUrl}${item.path}`;
      const count = item.baseFreq + Math.floor(Math.random() * 120);
      const isOk = Math.random() > 0.08;
      const statusCode = isOk ? 200 : (Math.random() > 0.5 ? 301 : 404);

      return {
        id: `link-${idx}-${Date.now()}`,
        url: fullUrl,
        path: item.path,
        domain: domain,
        parentUrl: item.depth === 0 ? cleanUrl : baseUrl,
        depth: item.depth,
        frequency: count,
        category: item.category,
        statusCode: statusCode,
        contentType: item.path.endsWith('.xml') ? 'application/xml' : item.path.endsWith('.txt') ? 'text/plain' : 'text/html',
        responseTimeMs: Math.floor(Math.random() * 140) + 24,
        sizeKb: (Math.random() * 45 + 5).toFixed(1),
        anchorText: item.category ? `${item.category}: ${item.path}` : item.path,
        lastCrawledAt: new Date().toISOString(),
        inFrontierQueue: false,
        processed: true,
        source: 'Simulated Engine',
      };
    });

  discoveredLinks.sort((a, b) => b.frequency - a.frequency);

  const totalOccurrences = discoveredLinks.reduce((acc, curr) => acc + curr.frequency, 0);
  const avgResponseTime = Math.round(discoveredLinks.reduce((acc, curr) => acc + curr.responseTimeMs, 0) / discoveredLinks.length);

  return {
    seedUrl: cleanUrl,
    domain: domain,
    crawledAt: new Date().toLocaleTimeString(),
    totalDiscovered: discoveredLinks.length,
    totalOccurrences: totalOccurrences,
    avgResponseTimeMs: avgResponseTime,
    maxDepth: maxDepth,
    links: discoveredLinks,
    isFromBackend: false,
    backendEngine: 'Simulated Frontier Engine',
    domainStats: {
      depth0Count: discoveredLinks.filter(l => l.depth === 0).length,
      depth1Count: discoveredLinks.filter(l => l.depth === 1).length,
      depth2Count: discoveredLinks.filter(l => l.depth === 2).length,
      depth3Count: discoveredLinks.filter(l => l.depth === 3).length,
      status200Count: discoveredLinks.filter(l => l.statusCode === 200).length,
      status3xxCount: discoveredLinks.filter(l => l.statusCode >= 300 && l.statusCode < 400).length,
      status4xxCount: discoveredLinks.filter(l => l.statusCode >= 400).length,
    }
  };
};

// Execute Crawl Request connected to Spring Boot Backend
export const executeCrawlRequest = async (url, options = {}) => {
  const config = getStoredBackendConfig();

  if (config.useRealBackend) {
    try {
      const endpoint = config.apiUrl || '/api/neighbours';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url,
          frontier_url: url,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} (${response.statusText})`);
      }

      const rawData = await response.json();

      // Check if backend returned offline warning from proxy
      if (rawData && rawData.offline) {
        throw new Error(rawData.error || 'Spring Boot backend is offline');
      }

      // When Spring Boot CrawlerController responds, it returns List<String> of URLs
      if (Array.isArray(rawData)) {
        if (rawData.length === 0) {
          // Empty list from MongoDB findByUrl
          return {
            isSimulated: false,
            isFromBackend: true,
            backendStatus: 'connected',
            note: 'Backend returned 0 links for this URL in MongoDB. Showing fallback preview.',
            data: generateFrontierCrawlResults(url, options.depth || 2),
            rawBackendUrls: [],
          };
        }

        const formattedResult = transformBackendUrlsToFrontierResults(url, rawData);
        return {
          isSimulated: false,
          isFromBackend: true,
          backendStatus: 'connected',
          data: formattedResult,
          rawBackendUrls: rawData,
        };
      }

      // If backend returned object with links
      if (rawData && Array.isArray(rawData.links)) {
        return {
          isSimulated: false,
          isFromBackend: true,
          backendStatus: 'connected',
          data: rawData,
        };
      }

      // Fallback
      return {
        isSimulated: true,
        data: generateFrontierCrawlResults(url, options.depth || 2),
      };
    } catch (err) {
      console.warn('Spring Boot Backend request failed, falling back to simulated engine:', err.message);
      const simData = generateFrontierCrawlResults(url, options.depth || 2);
      return {
        isSimulated: true,
        isFromBackend: false,
        backendStatus: 'offline',
        error: `Spring Boot Backend on :8080 unreachable (${err.message}). Showing interactive simulation.`,
        data: simData,
      };
    }
  }

  // Simulation mode
  const simData = generateFrontierCrawlResults(url, options.depth || 2);
  return {
    isSimulated: true,
    isFromBackend: false,
    backendStatus: 'disabled',
    data: simData,
  };
};
