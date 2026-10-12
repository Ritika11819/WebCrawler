// Service for Web Crawler Frontier & Backend Integration (Spring Boot + MongoDB)
// Endpoints:
//   POST /neighbours  -> BFS crawl from seed URL (body: { url: seedUrl })
//   GET  /shortcuts   -> Returns top URLs from database/frequency

const BACKEND_CONFIG_KEY = 'searchgenie_backend_config';

export const getStoredBackendConfig = () => {
  try {
    const saved = localStorage.getItem(BACKEND_CONFIG_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to parse backend config', e);
  }
  return {
    useRealBackend: true,
    apiUrl: '/neighbours',
    shortcutsUrl: '/shortcuts',
    springBootPort: '8080',
    directApiUrl: 'http://localhost:8080/neighbours',
  };
};

export const saveStoredBackendConfig = (config) => {
  localStorage.setItem(BACKEND_CONFIG_KEY, JSON.stringify(config));
};

// ==========================================================================
// SHORTCUTS ENDPOINT — /shortcuts
// Calls GET /shortcuts (or /api/shortcuts)
// Backend returns List<URL> containing URLs and their neighbors from the database.
// ==========================================================================
export const fetchShortcutsFromBackend = async () => {
  try {
    let response;
    try {
      response = await fetch('/shortcuts', {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch {
      response = await fetch('/api/shortcuts', {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!response || !response.ok) {
      response = await fetch('/api/shortcuts', {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!response || !response.ok) {
      throw new Error(`HTTP ${response?.status || 'network error'}`);
    }

    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      const colors = ['violet', 'blue', 'orange', 'emerald', 'amber', 'rose', 'cyan'];
      return data.map((item, idx) => {
        const rawUrl = typeof item === 'string' ? item : (item?.url || '');
        if (!rawUrl) return null;

        let domain = rawUrl;
        let title = rawUrl;
        try {
          const parsed = new URL(rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`);
          domain = parsed.hostname.replace(/^www\./, '');
          const parts = domain.split('.');
          title = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
        } catch {
          domain = rawUrl;
          title = rawUrl;
        }

        const neighborsCount = Array.isArray(item?.neighbors) ? item.neighbors.length : 0;

        return {
          id: `shortcut-backend-${idx}`,
          title,
          domain,
          frontierUrl: rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`,
          samplePath: '/',
          frequency: item?.frequency || 1,
          visitCount: 1,
          color: colors[idx % colors.length],
          category: 'Database Seed',
          lastCrawled: 'MongoDB Database',
          discoveredCount: neighborsCount,
          source: 'database',
          neighbors: item?.neighbors || [],
        };
      }).filter(Boolean);
    }
    return [];
  } catch (err) {
    console.warn('[/shortcuts] Backend endpoint request:', err.message);
    return [];
  }
};

// No hardcoded dummy shortcuts; all shortcuts are fetched from the database
export const getStoredShortcuts = () => {
  return [];
};

// Formats raw URL strings from Spring Boot Backend (/neighbours)
// into structured frontier links for rendering in the UI
export const transformBackendUrlsToFrontierResults = (seedUrl, urlList) => {
  let cleanSeed = (seedUrl || '').trim();
  if (cleanSeed && !cleanSeed.startsWith('http://') && !cleanSeed.startsWith('https://')) {
    cleanSeed = `https://${cleanSeed}`;
  }

  let domain = cleanSeed;
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

    const pathParts = path.split('/').filter(Boolean);
    const depth = Math.min(3, Math.max(1, pathParts.length));

    let category = 'Discovered Link';
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
      frequency: 1,
      category: category,
      statusCode: 200,
      contentType: 'text/html',
      responseTimeMs: 0,
      sizeKb: '0.0',
      anchorText: path,
      lastCrawledAt: new Date().toISOString(),
      inFrontierQueue: false,
      processed: true,
      source: 'Spring Boot Backend Database (/neighbours)',
    };
  });

  return {
    seedUrl: cleanSeed,
    domain: domain,
    crawledAt: new Date().toLocaleTimeString(),
    totalDiscovered: links.length,
    totalOccurrences: links.length,
    avgResponseTimeMs: 0,
    maxDepth: links.length > 0 ? Math.max(...links.map((l) => l.depth)) : 1,
    links: links,
    isFromBackend: true,
    backendEngine: 'Spring Boot BFS (/neighbours)',
    domainStats: {
      depth0Count: 1,
      depth1Count: links.filter((l) => l.depth === 1).length,
      depth2Count: links.filter((l) => l.depth === 2).length,
      depth3Count: links.filter((l) => l.depth >= 3).length,
      status200Count: links.length,
      status3xxCount: 0,
      status4xxCount: 0,
    },
  };
};

// Execute Crawl Request connected to Spring Boot Backend /neighbours
export const executeCrawlRequest = async (url, options = {}) => {
  const cleanUrl = (url || '').trim();

  let response;
  try {
    response = await fetch('/neighbours', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: cleanUrl,
      }),
    });
  } catch {
    response = await fetch('/api/neighbours', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: cleanUrl,
      }),
    });
  }

  if (!response || !response.ok) {
    response = await fetch('/api/neighbours', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: cleanUrl,
      }),
    });
  }

  if (!response || !response.ok) {
    throw new Error(`HTTP ${response?.status || '503'} (${response?.statusText || 'Backend unreachable'})`);
  }

  const rawData = await response.json();

  if (Array.isArray(rawData)) {
    const formattedResult = transformBackendUrlsToFrontierResults(cleanUrl, rawData);
    return {
      isSimulated: false,
      isFromBackend: true,
      backendStatus: 'connected',
      data: formattedResult,
      rawBackendUrls: rawData,
    };
  }

  if (rawData && Array.isArray(rawData.links)) {
    return {
      isSimulated: false,
      isFromBackend: true,
      backendStatus: 'connected',
      data: rawData,
    };
  }

  return {
    isSimulated: false,
    isFromBackend: true,
    backendStatus: 'connected',
    data: transformBackendUrlsToFrontierResults(cleanUrl, []),
    rawBackendUrls: [],
  };
};
