import { Component } from '@angular/core';
import { WeatherService } from 'src/services/weather-service/weather.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    standalone: false
})
export class DashboardComponent {
    constructor(private weatherService: WeatherService) { 
        // Beispielaufruf der DWD API
        weatherService.getTemperature(1420).subscribe(data => {
            console.log('Temperaturdaten:', data);
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
