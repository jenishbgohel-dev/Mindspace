import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  // Port 3000 is required by the AI Studio environment and Nginx reverse proxy.
  // In the container, Nginx binds to 8080 and proxies traffic to 3000.
  const envPort = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const PORT = envPort === 8080 ? 3000 : envPort;
  const isProduction = process.env.NODE_ENV === 'production' || fs.existsSync(path.resolve(__dirname, 'dist'));

  app.use(express.json());

  // Health check endpoint for Cloud Run
  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  // Example API routes if needed
  app.get('/api/ping', (_req, res) => {
    res.json({ message: 'MindSpace API active' });
  });

  if (!isProduction) {
    // In dev: mount Vite middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    // In production: serve built files from dist
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));

    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MindSpace Server running on http://0.0.0.0:${PORT} (Production: ${isProduction})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
