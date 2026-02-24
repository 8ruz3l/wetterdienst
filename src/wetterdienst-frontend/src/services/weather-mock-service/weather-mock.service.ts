import { Injectable } from '@angular/core';
import { Station, WeatherAlert, TemperatureData } from '../../types/weather.types';

@Injectable({ providedIn: 'root' })
export class WeatherMockService {

  getStations(): Station[] {
    return [
      { id: 1420, name: 'Frankfurt am Main', bundesland: 'Hessen' },
      { id: 3379, name: 'München',            bundesland: 'Bayern' },
      { id: 433,  name: 'Berlin',             bundesland: 'Berlin' },
      { id: 1975, name: 'Hamburg',            bundesland: 'Hamburg' },
      { id: 2564, name: 'Köln',               bundesland: 'NRW' },
    ];
  }

  getTemperature(stationId: number): TemperatureData {
    return {
      stationId,
      date: new Date().toISOString().split('T')[0],
      tempAvg: 18.4,
      tempMax: 24.1,
      tempMin: 11.7,
      feelsLike: 17.0,
      humidityPercent: 65,
      trend: 'rising',
      hourly: [
        { hour: '06:00', temp: 11.7 },
        { hour: '08:00', temp: 13.2 },
        { hour: '10:00', temp: 15.8 },
        { hour: '12:00', temp: 18.4 },
        { hour: '14:00', temp: 22.0 },
        { hour: '16:00', temp: 24.1 },
        { hour: '18:00', temp: 21.5 },
        { hour: '20:00', temp: 17.3 },
      ],
    };
  }

  getAlerts(): WeatherAlert[] {
    return [
      {
        id: 'alert-1',
        severity: 'warning',
        title: 'Starkregen',
        message: 'Lokale Gewitter mit Starkregen möglich.',
        validUntil: new Date(Date.now() + 3 * 60 * 60 * 1000),
      },
    ];
  }
}