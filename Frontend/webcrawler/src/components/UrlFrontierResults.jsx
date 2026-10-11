import React, { useState, useMemo } from 'react';
import {
  Search, ExternalLink, Copy, Check, Filter, ArrowUpDown, Network, ListFilter,
  BarChart2, FileJson, FileText, Globe, Layers, AlertCircle, ChevronRight, Hash
} from 'lucide-react';

export function UrlFrontierResults({ crawlResult, onSelectLinkDetail }) {
  const [filterQuery, setFilterQuery] = useState('');
  const [depthFilter, setDepthFilter] = useState('all');
  const [sortBy, setSortBy] = useState('frequency'); // 'frequency', 'path', 'depth', 'latency'
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('list'); // 'list', 'tree', 'analytics'
  const [copiedId, setCopiedId] = useState(null);

  const links = crawlResult?.links || [];

  // Filtered and sorted links
  const processedLinks = useMemo(() => {
    let result = [...links];

    if (filterQuery.trim()) {
      const q = filterQuery.toLowerCase();
      result = result.filter(
        (link) =>
          link.url.toLowerCase().includes(q) ||
          link.path.toLowerCase().includes(q) ||
          (link.category && link.category.toLowerCase().includes(q))
      );
    }

    if (depthFilter !== 'all') {
      result = result.filter((link) => link.depth === Number(depthFilter));
    }

    result.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [links, filterQuery, depthFilter, sortBy, sortOrder]);

  const maxFrequency = useMemo(() => {
    if (!links.length) return 1;
    return Math.max(...links.map((l) => l.frequency));
  }, [links]);

  const handleCopyUrl = (url, id, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(crawlResult, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `frontier_crawl_${crawlResult?.domain}_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportCSV = () => {
    const headers = ['URL', 'Path', 'Domain', 'Depth', 'Frequency', 'Status', 'LatencyMs'];
    const rows = links.map(l => [
      `"${l.url}"`, `"${l.path}"`, `"${l.domain}"`, l.depth, l.frequency, l.statusCode, l.responseTimeMs
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `frontier_urls_${crawlResult?.domain}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  if (!crawlResult) return null;

  return (
    <div className="frontier-results-card-glass">
      {/* Top Results Toolbar */}
      <div className="results-toolbar-header">
        <div className="header-info">
          <div className="seed-badge-pill">
            <Globe size={14} />
            <span>Seed: {crawlResult.seedUrl}</span>
          </div>
          <h2 className="toolbar-title">Discovered Sub-URLs & Frontier Links</h2>
          <p className="toolbar-desc">
            Showing <strong>{processedLinks.length}</strong> of {links.length} URLs found residing under this frontier seed
          </p>
        </div>

        {/* View Switches & Export Buttons */}
        <div className="header-actions-wrap">
          <div className="view-switch-glass">
            <button
              className={`switch-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List & Grid View"
            >
              <ListFilter size={15} />
              <span>List</span>
            </button>
            <button
              className={`switch-btn ${viewMode === 'tree' ? 'active' : ''}`}
              onClick={() => setViewMode('tree')}
              title="Frontier Tree Hierarchy View"
            >
              <Network size={15} />
              <span>Tree Graph</span>
            </button>
            <button
              className={`switch-btn ${viewMode === 'analytics' ? 'active' : ''}`}
              onClick={() => setViewMode('analytics')}
              title="Frequency Stats Chart View"
            >
              <BarChart2 size={15} />
              <span>Frequency</span>
            </button>
          </div>

          <div className="export-dropdown-glass">
            <button className="export-btn glass-btn" onClick={handleExportJSON} title="Export Frontier JSON">
              <FileJson size={15} />
              <span>JSON</span>
            </button>
            <button className="export-btn glass-btn" onClick={handleExportCSV} title="Export CSV Spreadsheet">
              <FileText size={15} />
              <span>CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Sort Controls */}
      <div className="filters-bar-glass">
        <div className="search-filter-input-wrap">
          <Search size={16} className="filter-icon" />
          <input
            type="text"
            className="filter-input"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Filter discovered sub-urls (e.g., /api, docs, blog)..."
          />
          {filterQuery && (
            <button className="clear-filter-btn" onClick={() => setFilterQuery('')}>
              &times;
            </button>
          )}
        </div>

        <div className="filters-right-group">
          {/* Depth Filter */}
          <div className="filter-select-wrap">
            <Filter size={14} />
            <select
              value={depthFilter}
              onChange={(e) => setDepthFilter(e.target.value)}
              className="glass-select"
            >
              <option value="all">All Depths</option>
              <option value="0">Depth 0 (Root)</option>
              <option value="1">Depth 1 (Direct Subpages)</option>
              <option value="2">Depth 2 (Sub-links)</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="filter-select-wrap">
            <ArrowUpDown size={14} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="glass-select"
            >
              <option value="frequency">Sort by Frequency (Hits)</option>
              <option value="path">Sort by Path Name</option>
              <option value="depth">Sort by Depth Level</option>
              <option value="responseTimeMs">Sort by Response Time</option>
            </select>
          </div>

          <button
            className="sort-order-btn glass-btn-icon"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            title={`Order: ${sortOrder.toUpperCase()}`}
          >
            {sortOrder === 'asc' ? '▲' : '▼'}
          </button>
        </div>
      </div>

      {/* VIEW 1: Sub-URLs List / Grid View */}
      {viewMode === 'list' && (
        <div className="links-table-container">
          <div className="table-header-row">
            <span className="col-rank">#</span>
            <span className="col-url">Sub-URL Path</span>
            <span className="col-category">Category</span>
            <span className="col-depth">Depth</span>
            <span className="col-frequency">Usage Frequency & Bar</span>
            <span className="col-status">Status</span>
            <span className="col-actions">Actions</span>
          </div>

          <div className="table-body">
            {processedLinks.length > 0 ? (
              processedLinks.map((link, idx) => {
                const freqPct = Math.min(100, Math.round((link.frequency / maxFrequency) * 100));

                return (
                  <div
                    key={link.id}
                    className="table-row-glass"
                    onClick={() => onSelectLinkDetail(link)}
                  >
                    <span className="col-rank font-mono">{idx + 1}</span>

                    <div className="col-url url-info">
                      <div className="url-main-path">
                        <strong className="path-text">{link.path}</strong>
                        <span className="domain-subtext">{link.domain}</span>
                      </div>
                      <small className="full-url-preview">{link.url}</small>
                    </div>

                    <span className="col-category">
                      <span className="cat-badge">{link.category || 'Page'}</span>
                    </span>

                    <span className="col-depth">
                      <span className={`depth-badge depth-${link.depth}`}>L{link.depth}</span>
                    </span>

                    <div className="col-frequency frequency-bar-wrap">
                      <div className="freq-numbers">
                        <b className="freq-val">{link.frequency.toLocaleString()}</b>
                        <span className="freq-label">hits</span>
                      </div>
                      <div className="freq-progress-track">
                        <div
                          className="freq-progress-fill"
                          style={{ width: `${freqPct}%` }}
                        />
                      </div>
                    </div>

                    <span className="col-status">
                      <span
                        className={`status-pill ${
                          link.statusCode === 200
                            ? 'status-ok'
                            : link.statusCode >= 300 && link.statusCode < 400
                            ? 'status-redirect'
                            : 'status-error'
                        }`}
                      >
                        {link.statusCode}
                      </span>
                    </span>

                    <div className="col-actions action-btns">
                      <button
                        className="glass-action-btn"
                        onClick={(e) => handleCopyUrl(link.url, link.id, e)}
                        title="Copy full URL"
                      >
                        {copiedId === link.id ? <Check size={14} className="text-emerald" /> : <Copy size={14} />}
                      </button>

                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass-action-btn"
                        onClick={(e) => e.stopPropagation()}
                        title="Open sub-URL in new browser tab"
                      >
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="empty-results-glass">
                <AlertCircle size={24} />
                <span>No sub-URLs match your current filter query "{filterQuery}".</span>
                <button className="reset-filter-btn" onClick={() => setFilterQuery('')}>
                  Reset Filter
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: Frontier Tree Hierarchy View */}
      {viewMode === 'tree' && (
        <div className="frontier-tree-view-glass">
          <div className="tree-root-node">
            <div className="tree-node-card root">
              <Globe size={18} />
              <div className="node-content">
                <strong>{crawlResult.domain}</strong>
                <small>{crawlResult.seedUrl}</small>
              </div>
              <span className="node-badge">Root Seed (Depth 0)</span>
            </div>
          </div>

          <div className="tree-branches-container">
            {/* Group links by Depth 1 */}
            {links
              .filter((l) => l.depth === 1)
              .slice(0, 10)
              .map((depth1Link) => {
                const childLinks = links.filter((l) => l.depth === 2 && l.path.startsWith(depth1Link.path.split('/')[1] ? `/${depth1Link.path.split('/')[1]}` : depth1Link.path));

                return (
                  <div key={depth1Link.id} className="tree-branch-group">
                    <div className="tree-branch-line" />
                    <div
                      className="tree-node-card depth-1"
                      onClick={() => onSelectLinkDetail(depth1Link)}
                    >
                      <ChevronRight size={14} />
                      <div className="node-content">
                        <strong>{depth1Link.path}</strong>
                        <small>{depth1Link.category || 'Subpage'}</small>
                      </div>
                      <span className="node-freq">{depth1Link.frequency} hits</span>
                    </div>

                    {/* Children nodes at Depth 2 */}
                    {childLinks.length > 0 && (
                      <div className="tree-children-list">
                        {childLinks.map((child) => (
                          <div
                            key={child.id}
                            className="tree-node-card depth-2"
                            onClick={() => onSelectLinkDetail(child)}
                          >
                            <span className="child-dot" />
                            <div className="node-content">
                              <strong>{child.path}</strong>
                              <small>Depth 2 link</small>
                            </div>
                            <span className="node-freq">{child.frequency} hits</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* VIEW 3: Frequency Analytics Chart */}
      {viewMode === 'analytics' && (
        <div className="analytics-chart-glass">
          <div className="analytics-header">
            <h3>Sub-URL Frequency Breakdown</h3>
            <p>Visual representation of crawl occurrences and link density</p>
          </div>

          <div className="analytics-bars-list">
            {links.slice(0, 12).map((link, idx) => {
              const pct = Math.round((link.frequency / maxFrequency) * 100);

              return (
                <div key={link.id} className="analytics-bar-item">
                  <div className="bar-info-row">
                    <span className="bar-rank font-mono">#{idx + 1}</span>
                    <strong className="bar-path">{link.path}</strong>
                    <span className="bar-count">{link.frequency.toLocaleString()} hits ({pct}%)</span>
                  </div>
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{ width: `${pct}%` }}
                    >
                      <div className="bar-glow" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
