export interface Station {
  id: number;
  name: string;
  bundesland: string;
}

export interface WeatherAlert {
  id: string;
  severity: 'info' | 'warning' | 'danger';
  title: string;
  message: string;
  validUntil: Date;
}

export interface TemperatureData {
  stationId: number;
  date: string;
  tempAvg: number;
  tempMax: number;
  tempMin: number;
  feelsLike: number;
  humidityPercent: number;
  trend: 'rising' | 'falling' | 'stable';
  hourly: { hour: string; temp: number }[];
}