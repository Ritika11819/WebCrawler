// Service for Web Crawler Frontier & Backend Integration

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
    useRealBackend: false,
    apiUrl: 'http://localhost:5000/api/crawl',
    wsUrl: 'ws://localhost:5000/ws',
    authKey: '',
  };
};

export const saveStoredBackendConfig = (config) => {
  localStorage.setItem(BACKEND_CONFIG_KEY, JSON.stringify(config));
};

export const getStoredShortcuts = () => {
  try {
    const saved = localStorage.getItem(SHORTCUTS_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to parse shortcuts', e);
  }
  // Default sample shortcuts with initial usage frequency counts
  return [
    {
      id: '1',
      title: 'GitHub Core',
      domain: 'github.com',
      frontierUrl: 'https://github.com',
      samplePath: '/trending/javascript',
      frequency: 3420,
      visitCount: 154,
      color: 'violet',
      category: 'Developer',
      lastCrawled: '2 mins ago',
      discoveredCount: 1840,
    },
    {
      id: '2',
      title: 'Wikipedia Portal',
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
      samplePath: '/questions/tagged/python',
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
      samplePath: '/category/artificial-intelligence',
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
    // Add new shortcut
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
      category: 'User Saved',
      lastCrawled: 'Just now',
      discoveredCount: Math.floor(Math.random() * 800) + 100,
    });
    if (shortcuts.length > 8) shortcuts.pop();
  }
  saveShortcuts(shortcuts);
  return shortcuts;
};

// Generates hyper-realistic sub-URLs under the provided Frontier URL for realistic simulation
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

  // Domain specific path templates for ultra-realistic URL generation
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

  // Filter based on maxDepth and assign detailed metadata
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
        processed: true
      };
    });

  // Sort links by frequency descending
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

// API Call Wrapper for Friend's Backend
export const executeCrawlRequest = async (url, options = {}) => {
  const config = getStoredBackendConfig();

  if (config.useRealBackend) {
    try {
      const response = await fetch(config.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(config.authKey ? { Authorization: `Bearer ${config.authKey}` } : {}),
        },
        body: JSON.stringify({
          frontier_url: url,
          max_depth: options.depth || 2,
          concurrency: options.concurrency || 5,
        }),
      });

      if (!response.ok) {
        throw new Error(`Backend error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        isSimulated: false,
        data: data,
      };
    } catch (err) {
      console.warn('Backend API connection failed, falling back to simulation:', err.message);
      const simData = generateFrontierCrawlResults(url, options.depth || 2);
      return {
        isSimulated: true,
        error: `Backend unreachable (${err.message}). Showing interactive simulation.`,
        data: simData,
      };
    }
  }

  // Pure simulation mode
  const simData = generateFrontierCrawlResults(url, options.depth || 2);
  return {
    isSimulated: true,
    data: simData,
  };
};
