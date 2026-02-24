import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { TemperatureWidgetComponent } from '../../components/temperature-widget/temperature-widget.component';
import { WeatherMockService } from '../../services/weather-mock-service/weather-mock.service';
import { TemperatureData } from '../../types/weather.types';

@Component({
  selector: 'app-temperature-container',
  standalone: true,
  imports: [TemperatureWidgetComponent],
  template: `
    <app-temperature-widget
      [data]="data"
      [stationName]="stationName"
      [stationId]="stationId"
    />
  `,
})
export class TemperatureContainerComponent implements OnInit, OnChanges {
  @Input() stationId!: number;
  @Input() stationName!: string;

  data!: TemperatureData;

  constructor(private weatherService: WeatherMockService) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngOnChanges(): void {
    this.loadData();
  }

  private loadData(): void {
    // Später: HTTP call zum Express Server ersetzen
    this.data = this.weatherService.getTemperature(this.stationId);
  }
}