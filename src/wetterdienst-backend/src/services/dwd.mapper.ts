// ─── Typen ────────────────────────────────────────────────────────────────────

export interface MappedWeatherEntry {
  stationId: number;
  date: string;              // ISO 8601: YYYY-MM-DD

  // Temperatur (°C)
  tempAvg?: number;          // Tagesmittel
  tempMax?: number;          // Tagesmaximum
  tempMin?: number;          // Tagesminimum
  tempMinGroundLevel?: number; // Minimum 5cm über Boden

  // Niederschlag
  precipitationMm?: number;  // Niederschlagshöhe in mm
  precipitationType?: number; // 0=kein, 1=Regen, 2=Schnee, ...

  // Sonnenstunden
  sunshineDurationHours?: number; // Sonnenscheindauer in Stunden

  // Weitere Klimafelder
  windSpeedAvgMs?: number;   // Mittlere Windgeschwindigkeit m/s
  windGustMaxMs?: number;    // Maximale Windböe m/s
  cloudCoverOktas?: number;  // Bewölkungsgrad (0–8 Okta)
  humidityPercent?: number;  // Relative Luftfeuchte %
  vaporPressureHpa?: number; // Dampfdruck hPa
  airPressureHpa?: number;   // Luftdruck auf Stationshöhe hPa
  snowDepthCm?: number;      // Schneehöhe cm
  qualityLevel?: number;     // DWD Qualitätsstufe
}

// ─── Datum konvertieren: YYYYMMDD → YYYY-MM-DD ────────────────────────────────
function formatDate(raw: string | number): string {
  const s = String(raw);
  if (s.length !== 8) return s;
  return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;
}

// ─── Hilfsfunktion: Wert nur setzen wenn vorhanden und gültig ─────────────────
function num(val: unknown): number | undefined {
  const n = typeof val === 'number' ? val : parseFloat(String(val));
  if (isNaN(n) || n === -999 || n === -999.0) return undefined;
  return n;
}

// ─── Haupt-Mapper ─────────────────────────────────────────────────────────────
export function mapDwdRow(
  raw: Record<string, number | string>
): MappedWeatherEntry {
  // Datum-Feld ermitteln (DWD nutzt je nach Datensatz verschiedene Namen)
  const dateRaw =
    raw['mess_datum'] ??
    raw['mess_datum_beginn'] ??
    raw['datum'] ??
    '';

  return {
    stationId:               num(raw['stations_id']) ?? 0,
    date:                    formatDate(dateRaw),

    // Temperatur
    tempAvg:                 num(raw['tmk']),
    tempMax:                 num(raw['txk']),
    tempMin:                 num(raw['tnk']),
    tempMinGroundLevel:      num(raw['tgk']),

    // Niederschlag
    precipitationMm:         num(raw['rsk']),
    precipitationType:       num(raw['rskf']),

    // Sonnenstunden
    sunshineDurationHours:   num(raw['sdk']),

    // Wind
    windSpeedAvgMs:          num(raw['fm']),
    windGustMaxMs:           num(raw['fx']),

    // Weitere Klimadaten
    cloudCoverOktas:         num(raw['nm']),
    humidityPercent:         num(raw['upm']),
    vaporPressureHpa:        num(raw['vpm']),
    airPressureHpa:          num(raw['pm']),
    snowDepthCm:             num(raw['shk_tag']),
    qualityLevel:            num(raw['qn_9']) ?? num(raw['qn_3']) ?? num(raw['qn_4']),
  };
}

// ─── Array-Mapper ─────────────────────────────────────────────────────────────
export function mapDwdRows(
  rows: Record<string, number | string>[]
): MappedWeatherEntry[] {
  return rows.map(mapDwdRow);
}
