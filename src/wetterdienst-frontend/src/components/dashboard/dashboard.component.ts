import { Component } from '@angular/core';
import { DwdApiService } from 'src/services/dwd-api-service/dwd-api.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    standalone: false
})
export class DashboardComponent {
    constructor(dwdApiService: DwdApiService) { 
        // Beispielaufruf der DWD API
        dwdApiService.getAllDailyRainHistories().subscribe({
            next: (data) => console.log('Regendaten:', data),
            error: (error) => console.error('Fehler beim Abrufen der Regendaten:', error)
        });
    }

    public rainfallData = [
        { month: 'Januar', rainfall: 12 },
        { month: 'Februar', rainfall: 45 },
        { month: 'März', rainfall: 30 },
        { month: 'April', rainfall: 60 },
        { month: 'Mai', rainfall: 25 },
        { month: 'Juni', rainfall: 80 },
        { month: 'Juli', rainfall: null },
        { month: 'August', rainfall: 55 },
        { month: 'September', rainfall: 99 },
        { month: 'Oktober', rainfall: 35 },
        { month: 'November', rainfall: 20 },
        { month: 'Dezember', rainfall: 15 }
    ];
}
