import axios from 'axios';
import AdmZip from 'adm-zip';
import iconv from 'iconv-lite';
import { DataType } from '../types';

// ─── DWD FTP Base URLs ────────────────────────────────────────────────────────
const DWD_BASE = 'https://opendata.dwd.de/climate_environment/CDC/observations_germany/climate/daily';

const DWD_PATHS: Record<DataType, string> = {
  temperature:   'kl',           // Klimadaten (enthält Temperatur)
  precipitation: 'more_precip',  // Niederschlag
  sunshine:      'solar',        // Sonnenstunden
};

// Datei-Präfixe in den ZIP-Archiven
const DATA_FILE_PREFIX: Record<DataType, string> = {
  temperature:   'produkt_klima_tag',
  precipitation: 'produkt_nieder_tag',
  sunshine:      'produkt_sd_tag',
};

// ─── Helper: Stations-ID auf 5 Stellen auffüllen ─────────────────────────────
function padStationId(id: number): string {
  return String(id).padStart(5, '0');
}

// ─── ZIP von DWD herunterladen ────────────────────────────────────────────────
async function downloadZip(url: string): Promise<Buffer> {
  const response = await axios.get<ArrayBuffer>(url, {
    responseType: 'arraybuffer',
    timeout: 30_000,
  });
  return Buffer.from(response.data);
}

// ─── ZIP-Dateiname auf DWD-Server ermitteln ───────────────────────────────────
// DWD benennt Dateien z.B.: tageswerte_KL_00001_19360101_19881231_hist.zip
// Wir fragen das Verzeichnislisting ab und suchen die passende Datei.
async function findZipUrl(
  dataType: DataType,
  stationId: number,
  period: 'historical' | 'recent'
): Promise<string> {
  const paddedId = padStationId(stationId);
  const dir = `${DWD_BASE}/${DWD_PATHS[dataType]}/${period}/`;

  // Verzeichnislisting abrufen
  const { data: html } = await axios.get<string>(dir, { timeout: 15_000 });

  // Alle .zip Links aus dem HTML extrahieren
  const regex = /href="([^"]*_KL_[^"]*\.zip|[^"]*_RR_[^"]*\.zip|[^"]*_SD_[^"]*\.zip|[^"]*\.zip)"/gi;
  const matches = [...html.matchAll(regex)].map(m => m[1]);

  // Passende Datei für die Station finden
  const file = matches.find(f => f.includes(`_${paddedId}_`));
  if (!file) {
    throw new Error(`Keine ZIP-Datei für Station ${stationId} (${dataType}, ${period}) gefunden.`);
  }

  return dir + file;
}

// ─── CSV aus ZIP extrahieren und parsen ──────────────────────────────────────
function parseWeatherCsv(
  zipBuffer: Buffer,
  dataType: DataType
): Record<string, number | string>[] {
  const zip = new AdmZip(zipBuffer);
  const entries = zip.getEntries();

  const prefix = DATA_FILE_PREFIX[dataType];
  const dataEntry = entries.find(e => e.entryName.startsWith(prefix));

  if (!dataEntry) {
    throw new Error(`Datendatei mit Präfix "${prefix}" nicht im ZIP gefunden.`);
  }

  // DWD-Dateien sind oft in ISO-8859-1 kodiert
  const raw = iconv.decode(dataEntry.getData(), 'ISO-8859-1');
  const lines = raw.split('\n').filter(l => l.trim().length > 0);

  if (lines.length < 2) return [];

  // Header-Zeile parsen (Trennzeichen: Semikolon)
  const headers = lines[0].split(';').map(h => h.trim().toLowerCase().replace(/\s+/g, '_'));

  const rows: Record<string, number | string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(';');
    if (cols.length < headers.length) continue;

    const row: Record<string, number | string> = {};
    headers.forEach((h, idx) => {
      const val = cols[idx]?.trim() ?? '';
      const num = parseFloat(val.replace(',', '.'));
      row[h] = isNaN(num) ? val : num;
    });

    // Ungültige Messwerte (-999) herausfiltern
    const hasInvalid = Object.values(row).some(v => v === -999 || v === -999.0);
    if (!hasInvalid) rows.push(row);
  }

  return rows;
}

// ─── Öffentliche Service-Funktionen ──────────────────────────────────────────

export async function fetchWeatherData(
  dataType: DataType,
  stationId: number,
  period: 'historical' | 'recent' = 'recent'
): Promise<Record<string, number | string>[]> {
  const url = await findZipUrl(dataType, stationId, period);
  const zipBuffer = await downloadZip(url);
  return parseWeatherCsv(zipBuffer, dataType);
}

// Gibt alle Daten einer Station für einen bestimmten Zeitraum zurück
export async function fetchWeatherRange(
  dataType: DataType,
  stationId: number,
  fromDate: string, // YYYYMMDD
  toDate: string    // YYYYMMDD
): Promise<Record<string, number | string>[]> {
  const from = parseInt(fromDate);
  const to = parseInt(toDate);

  // Für lange Zeiträume historische Daten abrufen, sonst recent
  const now = new Date();
  const recentCutoff = parseInt(
    `${now.getFullYear() - 1}${String(now.getMonth() + 1).padStart(2, '0')}01`
  );

  let rows: Record<string, number | string>[] = [];

  if (from < recentCutoff) {
    const hist = await fetchWeatherData(dataType, stationId, 'historical');
    rows.push(...hist);
  }

  if (to >= recentCutoff) {
    const recent = await fetchWeatherData(dataType, stationId, 'recent');
    rows.push(...recent);
  }

  // Nach Datum filtern und sortieren
  const dateKey = Object.keys(rows[0] ?? {}).find(k => k.includes('datum') || k.includes('date')) ?? 'mess_datum';

  return rows
    .filter(r => {
      const d = parseInt(String(r[dateKey]));
      return d >= from && d <= to;
    })
    .sort((a, b) => parseInt(String(a[dateKey])) - parseInt(String(b[dateKey])));
}
