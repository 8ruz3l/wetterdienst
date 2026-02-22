import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { APP_CONFIG, AppConfig } from '../../config';
import { RainHistoryEntry } from './dwd-api.types';

@Injectable({
  providedIn: 'root'
})
export class DwdApiService {

  constructor(@Inject(APP_CONFIG) private appConfig: AppConfig, private http: HttpClient ) { }

  /**
   * Ruft die Regenhistorie für eine bestimmte Station ab.
   * @param stationId - DWD Stations-ID (z.B. '01001')
   * @param resolution - Zeitauflösung ('hourly' | 'daily' | '10_minutes')
   */
  getRainHistory(
    stationId: string,
    resolution: 'hourly' | 'daily' | '10_minutes' = 'hourly'
  ): Observable<RainHistoryEntry[]> {
    const paddedId = stationId.padStart(5, '0');
    const url = `${this.appConfig.dwdApi.baseUrl}/${resolution}/precipitation/recent/stundenwerte_RR_${paddedId}_akt.zip`;

    return this.http.get(url, { responseType: 'blob' }).pipe(
      map((blob) => mapRainHistoryBlobToRainHistoryEntries(blob)),
      catchError((error) => {
        console.error('Fehler beim Abrufen der Regendaten:', error);
        throw error;
      })
    );
  }
}

function mapRainHistoryBlobToRainHistoryEntries(blob: Blob): RainHistoryEntry[] {
  // Hier müsste die Logik implementiert werden, um die ZIP-Datei zu entpacken,
  // die CSV-Datei zu lesen und die Daten in RainHistoryEntry-Objekte umzuwandeln.
  // Das ist ein komplexer Prozess, der Bibliotheken wie JSZip und Papaparse erfordern könnte.
  return [];
}