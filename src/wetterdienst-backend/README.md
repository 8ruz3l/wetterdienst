# DWD Weather Server

Express.js Backend mit TypeScript für die DWD (Deutscher Wetterdienst) Open Data API.

## Setup

```bash
npm install
npm run dev     # Entwicklung mit Auto-Reload
npm run build   # TypeScript kompilieren
npm start       # Production
```

Server läuft auf: `http://localhost:8080`  
CORS erlaubt für: `http://localhost:4200`

---

## API Endpunkte

### Health Check
```
GET /api/health
```

### Aktuelle Wetterdaten einer Station
```
GET /api/weather/:type/:stationId?period=recent
```

| Parameter  | Wert                                      |
|------------|-------------------------------------------|
| `type`     | `temperature` \| `precipitation` \| `sunshine` |
| `stationId`| DWD Stations-ID (z.B. `1420` für Frankfurt) |
| `period`   | `recent` (Standard) \| `historical`       |

**Beispiel:**
```
GET /api/weather/temperature/1420
GET /api/weather/precipitation/1420?period=historical
```

### Wetterdaten nach Zeitraum filtern
```
GET /api/weather/:type/:stationId/range?from=YYYYMMDD&to=YYYYMMDD
```

**Beispiel:**
```
GET /api/weather/temperature/1420/range?from=20230101&to=20231231
GET /api/weather/sunshine/1420/range?from=20200601&to=20200831
```

---

## Wichtige DWD Stations-IDs

| Stadt       | ID    |
|-------------|-------|
| Frankfurt   | 1420  |
| München     | 3379  |
| Berlin      | 433   |
| Hamburg     | 1975  |
| Köln        | 2564  |
| Stuttgart   | 4931  |

Alle Stationen: https://opendata.dwd.de/climate_environment/CDC/observations_germany/climate/daily/kl/recent/

---

## Response Format

```json
{
  "type": "temperature",
  "stationId": 1420,
  "period": "recent",
  "count": 500,
  "data": [
    {
      "stations_id": 1420,
      "mess_datum": 20240101,
      "qn_9": 10,
      "ttk": 3.2,
      "txk": 7.1,
      "tnk": -0.5,
      ...
    }
  ]
}
```

---

## Projektstruktur

```
src/
├── index.ts                  # Server-Einstiegspunkt (Port 8080)
├── types.ts                  # TypeScript Typen
├── middleware/
│   └── cors.ts               # CORS Konfiguration
├── routes/
│   └── weather.ts            # API Routen
└── services/
    └── dwd.service.ts        # DWD Download + ZIP-Parsing
```
