import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import http from 'node:http';

// Custom Vite plugin to bridge frontend requests to Spring Boot backend
// Spring Boot CrawlerController has @GetMapping("/neighbours") with @RequestBody URL seedUrl
// Browser fetch cannot send a body with GET requests, so this middleware forwards POST /api/neighbours
// as an HTTP GET request with the JSON body to http://localhost:8080/neighbours
function springBootProxyPlugin() {
  return {
    name: 'spring-boot-crawler-proxy',
    configureServer(server) {
      server.middlewares.use('/api/neighbours', (req, res, next) => {
        if (req.method === 'OPTIONS') {
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
          res.statusCode = 204;
          res.end();
          return;
        }

        let body = '';
        req.on('data', chunk => {
          body += chunk;
        });

        req.on('end', () => {
          let payload;
          try {
            payload = body ? JSON.parse(body) : {};
          } catch {
            payload = {};
          }

          const seedUrl = payload.url || payload.frontier_url || payload.seedUrl || '';

          const backendReq = http.request(
            {
              hostname: 'localhost',
              port: 8080,
              path: '/neighbours',
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(JSON.stringify({ url: seedUrl })),
              },
              timeout: 10000,
            },
            backendRes => {
              let backendData = '';
              backendRes.on('data', chunk => {
                backendData += chunk;
              });
              backendRes.on('end', () => {
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.statusCode = backendRes.statusCode || 200;
                res.end(backendData);
              });
            }
          );

          backendReq.on('timeout', () => {
            backendReq.destroy();
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 504;
            res.end(JSON.stringify({ error: 'Backend request timed out (10s)' }));
          });

          backendReq.on('error', err => {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 503;
            res.end(
              JSON.stringify({
                error: `Backend unreachable: ${err.message}`,
                offline: true,
                hint: 'Spring Boot backend is not running on http://localhost:8080. Start the backend with ./mvnw spring-boot:run',
              })
            );
          });

          backendReq.write(JSON.stringify({ url: seedUrl }));
          backendReq.end();
        });
      });

      // ==========================================================================
      // Proxy: GET /api/shortcuts → GET localhost:8080/shortcuts
      // Placeholder endpoint — backend will implement this to return List<String>
      // of most frequently accessed URLs. Until then, this returns 503 gracefully.
      // ==========================================================================
      server.middlewares.use('/api/shortcuts', (req, res) => {
        if (req.method === 'OPTIONS') {
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
          res.statusCode = 204;
          res.end();
          return;
        }

        const backendReq = http.request(
          {
            hostname: 'localhost',
            port: 8080,
            path: '/shortcuts',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            timeout: 5000,
          },
          backendRes => {
            let backendData = '';
            backendRes.on('data', chunk => { backendData += chunk; });
            backendRes.on('end', () => {
              res.setHeader('Content-Type', 'application/json');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.statusCode = backendRes.statusCode || 200;
              res.end(backendData);
            });
          }
        );

        backendReq.on('timeout', () => {
          backendReq.destroy();
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 503;
          res.end(JSON.stringify({ error: 'Shortcuts endpoint timed out' }));
        });

        backendReq.on('error', () => {
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 503;
          res.end(JSON.stringify({ error: 'Shortcuts endpoint not yet available', offline: true }));
        });

        backendReq.end();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), springBootProxyPlugin()],
  server: {
    port: 5173,
    host: true,
  },
});
