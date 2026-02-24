import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherMockService } from '../../services/weather-mock-service/weather-mock.service';
import { Station, WeatherAlert } from '../../types/weather.types';
import { TemperatureContainerComponent } from '../temperature-container/temperature-container.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, TemperatureContainerComponent],
  templateUrl: './dashboard-page.component.html',
})
export class DashboardPageComponent implements OnInit {
  stations: Station[] = [];
  selectedStation!: Station;
  alerts: WeatherAlert[] = [];

  constructor(private weatherService: WeatherMockService) {}

  
  ngOnInit(): void {
    this.stations = this.weatherService.getStations();
    this.selectedStation = this.stations[0];
    this.alerts = this.weatherService.getAlerts();
  }

  onStationChange(event: Event): void {
    const id = parseInt((event.target as HTMLSelectElement).value);
    const station = this.stations.find(s => s.id === id);
    if (station) this.selectedStation = station;
  }

  onAlertDismiss(id: string): void {
    this.alerts = this.alerts.filter(a => a.id !== id);
  }
}