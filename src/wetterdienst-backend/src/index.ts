import express from 'express';
import corsMiddleware from './middleware/cors';
import weatherRouter from './routes/weather';

const app = express();
const PORT = 8080;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(corsMiddleware);
app.use(express.json());

// ─── Routen ───────────────────────────────────────────────────────────────────
app.use('/api/weather', weatherRouter);

// Health-Check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 Fallback
app.use((_req, res) => {
  res.status(404).json({ error: 'Route nicht gefunden.' });
});

// ─── Server starten ───────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ DWD Weather Server läuft auf http://localhost:${PORT}`);
  console.log(`   CORS erlaubt für: http://localhost:4200`);
  console.log(`\n   Verfügbare Endpunkte:`);
  console.log(`   GET /api/health`);
  console.log(`   GET /api/weather/:type/:stationId`);
  console.log(`   GET /api/weather/:type/:stationId/range?from=YYYYMMDD&to=YYYYMMDD`);
  console.log(`\n   Typen: temperature | precipitation | sunshine`);
});
