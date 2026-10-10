import { useEffect, useMemo, useState } from 'react'
import './App.css'

const wallpapers = [
  '/wallpapers/kalen-emsley-Bkci_8qcdvQ-unsplash.jpg',
  '/wallpapers/luca-bravo-zAjdgNXsMeg-unsplash.jpg',
  '/wallpapers/jack-anstey-XVoyX7l9ocY-unsplash.jpg',
  '/wallpapers/iswanto-arif-OJ74pFtrYi0-unsplash.jpg',
  '/wallpapers/kace-rodriguez-p3OzJuT_Dks-unsplash.jpg',
  '/wallpapers/pietro-de-grandi-T7K4aEPoGGk-unsplash (1).jpg',
]

const sampleLinks = [
  { title: 'The Verge', url: 'theverge.com', path: '/tech', count: '1,240', color: 'coral' },
  { title: 'Product Hunt', url: 'producthunt.com', path: '/posts', count: '834', color: 'violet' },
  { title: 'A List Apart', url: 'alistapart.com', path: '/articles', count: '619', color: 'blue' },
  { title: 'CSS-Tricks', url: 'css-tricks.com', path: '/guides', count: '508', color: 'pink' },
  { title: 'Smashing Magazine', url: 'smashingmagazine.com', path: '/articles', count: '426', color: 'green' },
]

function Icon({ name, size = 18 }) {
  const paths = {
    arrow: <path d="M5 12h13m-5-5 5 5-5 5" />,
    globe: <><circle cx="12" cy="12" r="8.5" /><path d="M3.8 9h16.4M3.8 15h16.4M12 3.5c2.3 2.4 3.5 5.2 3.5 8.5s-1.2 6.1-3.5 8.5c-2.3-2.4-3.5-5.2-3.5-8.5S9.7 5.9 12 3.5Z" /></>,
    search: <><circle cx="10.8" cy="10.8" r="6.5" /><path d="m16 16 4 4" /></>,
    grid: <><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><rect x="14" y="14" width="6" height="6" rx="1" /></>,
    chart: <><path d="M4 19V5m0 14h16" /><path d="m7 15 3-4 3 2 5-7" /></>,
    clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5l3 2" /></>,
    spark: <path d="m12 3 1.8 6.2L20 11l-6.2 1.8L12 19l-1.8-6.2L4 11l6.2-1.8L12 3Z" />,
    external: <><path d="M14 4h6v6M20 4l-9 9" /><path d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5" /></>,
    moon: <path d="M20 15.5A8.5 8.5 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z" />,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

function App() {
  const [wallpaper, setWallpaper] = useState(0)
  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] = useState('overview')
  const [isCrawling, setIsCrawling] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  useEffect(() => {
    const interval = window.setInterval(() => setWallpaper((current) => (current + 1) % wallpapers.length), 7000)
    return () => window.clearInterval(interval)
  }, [])

  const visibleLinks = useMemo(() => {
    if (!query.trim()) return sampleLinks
    return sampleLinks.filter((link) => `${link.title} ${link.url}`.toLowerCase().includes(query.toLowerCase()))
  }, [query])

  const handleSearch = (event) => {
    event.preventDefault()
    if (!query.trim() || isCrawling) return
    setIsCrawling(true)
    setHasSearched(false)
    window.setTimeout(() => {
      setIsCrawling(false)
      setHasSearched(true)
    }, 850)
  }

  return (
    <main className="app-shell">
      <div className="wallpaper-stack" aria-hidden="true">
        {wallpapers.map((image, index) => <div className={`wallpaper ${index === wallpaper ? 'is-active' : ''}`} style={{ backgroundImage: `url("${image}")` }} key={image} />)}
      </div>
      <div className="ambient-glow" aria-hidden="true" />

      <nav className="topbar glass">
        <a className="brand" href="/" aria-label="SearchGenie home">
          <span className="brand-mark"><Icon name="spark" size={17} /></span>
          <span>searchgenie</span>
        </a>
        <div className="nav-links">
          <button className={activeTab === 'overview' ? 'nav-link active' : 'nav-link'} onClick={() => setActiveTab('overview')}><Icon name="grid" size={15} /> Overview</button>
          <button className={activeTab === 'insights' ? 'nav-link active' : 'nav-link'} onClick={() => setActiveTab('insights')}><Icon name="chart" size={15} /> Insights</button>
        </div>
        <div className="nav-actions">
          <span className="live-status"><i /> index online</span>
          <button className="icon-button" aria-label="Toggle appearance"><Icon name="moon" size={17} /></button>
          <div className="avatar">K</div>
        </div>
      </nav>

      <section className="hero-section">
        <p className="eyebrow"><span className="eyebrow-line" /> your quiet corner of the web</p>
        <h1>Find what’s <em>out there.</em></h1>
        <p className="hero-copy">Enter a frontier URL and let SearchGenie map every connected corner,<br className="desktop-break" /> one link at a time.</p>

        <form className="search-bar glass" onSubmit={handleSearch}>
          <span className="search-icon"><Icon name="globe" size={21} /></span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Paste a URL to begin crawling..." aria-label="Frontier URL" type="url" />
          <button className="crawl-button" type="submit">{isCrawling ? 'Crawling...' : 'Start crawl'} <Icon name="arrow" size={17} /></button>
        </form>
        <div className="search-hint"><span className="hint-key">↵</span> press enter to explore <span className="hint-dot">·</span> <span className="hint-key">⌘ K</span> focus search</div>
      </section>

      <section className="content-grid">
        <div className="results-card glass">
          <div className="card-heading">
            <div><div className="section-label">CURRENT CRAWL</div><h2>{hasSearched ? 'Crawl complete' : 'Your web constellation'}</h2></div>
            <span className="result-count"><span className="pulse-dot" /> {isCrawling ? 'Mapping links...' : '2,847 links found'}</span>
          </div>
          <div className="stats-row">
            <div className="stat"><span className="stat-value">2,847</span><span className="stat-label">total links</span></div>
            <div className="stat"><span className="stat-value">68<span className="stat-unit">ms</span></span><span className="stat-label">crawl time</span></div>
            <div className="stat"><span className="stat-value">94<span className="stat-unit">%</span></span><span className="stat-label">reachable</span></div>
            <div className="stat accent-stat"><span className="stat-value">#1</span><span className="stat-label">most frequent</span></div>
          </div>
          <div className="table-header"><span>URL</span><span>OCCURRENCES</span></div>
          <div className="link-list">
            {visibleLinks.length ? visibleLinks.map((link, index) => <a className="link-row" href={`https://${link.url}${link.path}`} target="_blank" rel="noreferrer" key={link.url}>
              <span className={`site-icon ${link.color}`}>{link.title.charAt(0)}</span>
              <span className="link-info"><strong>{link.url}</strong><small>{link.path}</small></span>
              <span className="occurrence"><b>{link.count}</b><span className="bar"><i style={{ width: `${100 - index * 13}%` }} /></span></span>
              <Icon name="external" size={15} />
            </a>) : <div className="empty-state"><Icon name="search" size={20} /> No indexed links match that search.</div>}
          </div>
          <button className="view-all" onClick={() => setQuery('')}>View all discovered links <Icon name="arrow" size={15} /></button>
        </div>

        <aside className="side-column">
          <div className="shortcuts-card glass">
            <div className="card-heading compact"><div><div className="section-label">QUICK ACCESS</div><h2>Shortcuts</h2></div><button className="more-button" aria-label="More shortcuts">•••</button></div>
            <p className="side-copy">Your most visited paths from the last crawl.</p>
            <div className="shortcut-list">
              {sampleLinks.slice(0, 4).map((link, index) => <button className="shortcut" key={link.url} onClick={() => setQuery(link.url)}><span className={`shortcut-number ${link.color}`}>0{index + 1}</span><span>{link.title}</span><Icon name="arrow" size={14} /></button>)}
            </div>
          </div>
          <div className="tip-card glass"><span className="tip-icon"><Icon name="spark" size={17} /></span><div><strong>Genie tip</strong><p>Start with a homepage to reveal its full constellation.</p></div></div>
        </aside>
      </section>
      <footer><span>SEARCHGENIE <b>·</b> WEB INTELLIGENCE, MADE SIMPLE</span><span className="footer-right"><i /> system operational <span className="footer-version">v0.1.0</span></span></footer>
    </main>
  )
}

export default App
