import { Router, Request, Response } from 'express';
import { fetchWeatherData, fetchWeatherRange } from '../services/dwd.service';
import { mapDwdRows } from '../services/dwd.mapper';
import { DataType } from '../types';

const router = Router();

const VALID_TYPES: DataType[] = ['temperature', 'precipitation', 'sunshine'];

// ─── GET /api/weather/:type/:stationId ────────────────────────────────────────
// Gibt die aktuellen Daten (recent) einer Station zurück.
//
// Params:
//   type      – temperature | precipitation | sunshine
//   stationId – DWD Stations-ID (z.B. 1420 für Frankfurt)
//
// Query (optional):
//   period – historical | recent (Standard: recent)
//
// Beispiel: GET /api/weather/temperature/1420
router.get('/:type/:stationId', async (req: Request, res: Response) => {
  const type = req.params.type as DataType;
  const stationId = parseInt(req.params.stationId);
  const period = (req.query.period as 'historical' | 'recent') ?? 'recent';

  if (!VALID_TYPES.includes(type)) {
    return res.status(400).json({
      error: `Ungültiger Typ. Erlaubt: ${VALID_TYPES.join(', ')}`,
    });
  }

  if (isNaN(stationId)) {
    return res.status(400).json({ error: 'stationId muss eine Zahl sein.' });
  }

  if (!['historical', 'recent'].includes(period)) {
    return res.status(400).json({ error: 'period muss "historical" oder "recent" sein.' });
  }

  try {
    const raw = await fetchWeatherData(type, stationId, period);
    const data = mapDwdRows(raw);
    return res.json({ type, stationId, period, count: data.length, data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unbekannter Fehler';
    console.error(`[DWD] Fehler bei ${type}/${stationId}:`, message);
    return res.status(502).json({ error: `DWD-Anfrage fehlgeschlagen: ${message}` });
  }
});

// ─── GET /api/weather/:type/:stationId/range ─────────────────────────────────
// Filtert Daten nach Zeitraum.
//
// Query (Pflicht):
//   from – Startdatum YYYYMMDD
//   to   – Enddatum   YYYYMMDD
//
// Beispiel: GET /api/weather/temperature/1420/range?from=20230101&to=20231231
router.get('/:type/:stationId/range', async (req: Request, res: Response) => {
  const type = req.params.type as DataType;
  const stationId = parseInt(req.params.stationId);
  const { from, to } = req.query as { from?: string; to?: string };

  if (!VALID_TYPES.includes(type)) {
    return res.status(400).json({ error: `Ungültiger Typ. Erlaubt: ${VALID_TYPES.join(', ')}` });
  }

  if (isNaN(stationId)) {
    return res.status(400).json({ error: 'stationId muss eine Zahl sein.' });
  }

  if (!from || !to) {
    return res.status(400).json({ error: 'Query-Parameter "from" und "to" sind Pflicht (Format: YYYYMMDD).' });
  }

  if (!/^\d{8}$/.test(from) || !/^\d{8}$/.test(to)) {
    return res.status(400).json({ error: '"from" und "to" müssen das Format YYYYMMDD haben.' });
  }

  if (parseInt(from) > parseInt(to)) {
    return res.status(400).json({ error: '"from" darf nicht nach "to" liegen.' });
  }

  try {
    const raw = await fetchWeatherRange(type, stationId, from, to);
    const data = mapDwdRows(raw);
    return res.json({ type, stationId, from, to, count: data.length, data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unbekannter Fehler';
    console.error(`[DWD] Fehler bei Range ${type}/${stationId}:`, message);
    return res.status(502).json({ error: `DWD-Anfrage fehlgeschlagen: ${message}` });
  }
});

export default router;
