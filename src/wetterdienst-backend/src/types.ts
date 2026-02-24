export interface WeatherDataRow {
  stationsId: number;
  messDatum: string;       // YYYYMMDD
  qualitaet: number;
  wert: number;
}

export interface TemperaturRow extends WeatherDataRow {
  lufttemperatur: number;  // Tagesmittel °C
  tempMax: number;
  tempMin: number;
}

export interface NiederschlagRow extends WeatherDataRow {
  niederschlagshoehe: number; // mm
  niederschlagsform: number;
}

export interface SonnenstundenRow extends WeatherDataRow {
  sonnenscheindauer: number; // Stunden
}

export interface StationInfo {
  stationsId: number;
  name: string;
  bundesland: string;
  latitude: number;
  longitude: number;
  hoehe: number;
}

export type DataType = 'temperature' | 'precipitation' | 'sunshine';
