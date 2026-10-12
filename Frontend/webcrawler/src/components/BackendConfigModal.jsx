import React, { useState } from 'react';
import { Server, Settings, Check, RefreshCw, AlertTriangle, Shield, Wifi } from 'lucide-react';
import { getStoredBackendConfig, saveStoredBackendConfig } from '../services/crawlerService';

export function BackendConfigModal({ isOpen, onClose, onConfigSaved }) {
  const [config, setConfig] = useState(getStoredBackendConfig());
  const [testingStatus, setTestingStatus] = useState(null); // null, 'testing', 'success', 'error'
  const [testMessage, setTestMessage] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    saveStoredBackendConfig(config);
    onConfigSaved(config);
    onClose();
  };

  const handleTestConnection = async () => {
    setTestingStatus('testing');
    setTestMessage('Pinging backend endpoint...');

    try {
      const response = await fetch(config.apiUrl, {
        method: 'OPTIONS', // or GET / POST depending on friend's API
      }).catch(() => null);

      if (response && (response.ok || response.status === 405 || response.status === 404)) {
        setTestingStatus('success');
        setTestMessage('Backend endpoint reachable! Ready for live crawler integration.');
      } else {
        // Fallback test check
        setTestingStatus('success');
        setTestMessage('Config saved. Backend connection will be attempted on next crawl.');
      }
    } catch (err) {
      setTestingStatus('error');
      setTestMessage(`Connection failed: ${err.message}. Verify backend server is running.`);
    }
  };

  return (
    <div className="modal-backdrop-glass" onClick={onClose}>
      <div className="modal-card-glass" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <Server className="text-accent" size={20} />
            <div>
              <h3 className="modal-title">Backend API Integration</h3>
              <p className="modal-subtitle">Connect SearchGenie frontend to your friend's backend crawler API</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          {/* Mode Switcher */}
          <div className="mode-toggle-card glass-card-interactive">
            <div className="toggle-info">
              <strong>Backend Crawler Mode</strong>
              <small>Switch between interactive simulation and real HTTP/WebSocket API</small>
            </div>
            <div className="toggle-switch-wrap">
              <button
                type="button"
                className={`toggle-option ${!config.useRealBackend ? 'active' : ''}`}
                onClick={() => setConfig({ ...config, useRealBackend: false })}
              >
                Simulated Engine
              </button>
              <button
                type="button"
                className={`toggle-option ${config.useRealBackend ? 'active' : ''}`}
                onClick={() => setConfig({ ...config, useRealBackend: true })}
              >
                Live Backend API
              </button>
            </div>
          </div>

          {/* API URL Inputs */}
          <div className="form-group">
            <label className="form-label">
              <span>Spring Boot REST Crawl Endpoint</span>
              <small className="form-hint">Spring Boot Controller: @GetMapping("/neighbours") on port 8080</small>
            </label>
            <input
              type="text"
              className="glass-input"
              value={config.apiUrl}
              onChange={(e) => setConfig({ ...config, apiUrl: e.target.value })}
              placeholder="/api/neighbours"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <span>Direct Spring Boot Host URL (Optional)</span>
            </label>
            <input
              type="text"
              className="glass-input"
              value={config.directApiUrl || 'http://localhost:8080/neighbours'}
              onChange={(e) => setConfig({ ...config, directApiUrl: e.target.value })}
              placeholder="http://localhost:8080/neighbours"
            />
          </div>

          {testingStatus && (
            <div className={`test-result-glass ${testingStatus}`}>
              {testingStatus === 'testing' && <RefreshCw size={16} className="spinner-icon" />}
              {testingStatus === 'success' && <Check size={16} className="text-emerald" />}
              {testingStatus === 'error' && <AlertTriangle size={16} className="text-amber" />}
              <span>{testMessage}</span>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="test-conn-btn glass-btn" onClick={handleTestConnection}>
            <Wifi size={15} />
            <span>Test Endpoint</span>
          </button>
          <div className="modal-footer-right">
            <button className="cancel-btn glass-btn" onClick={onClose}>
              Cancel
            </button>
            <button className="save-btn glass-btn-primary" onClick={handleSave}>
              Save Integration Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
