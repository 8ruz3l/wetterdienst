import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { APP_CONFIG, AppConfig } from '../../config/config';
import { RainHistoryEntry } from './weather.types';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private readonly API: string;

  constructor(@Inject(APP_CONFIG) private appConfig: AppConfig, private http: HttpClient ) { 
    this.API = appConfig.API.baseUrl;
  }

  getTemperature(stationId: number): Observable<any> {
    return this.http.get(`${this.API}/weather/temperature/${stationId}`);
  }

  getPrecipitation(stationId: number): Observable<any> {
    return this.http.get(`${this.API}/weather/precipitation/${stationId}`);
  }

  getSunshine(stationId: number): Observable<any> {
    return this.http.get(`${this.API}/weather/sunshine/${stationId}`);
  }

  getRange(type: string, stationId: number, from: string, to: string): Observable<any> {
    return this.http.get(
      `${this.API}/weather/${type}/${stationId}/range?from=${from}&to=${to}`
    );
  }
}