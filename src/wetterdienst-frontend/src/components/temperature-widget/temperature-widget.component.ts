import {
  Component,
  Input,
  OnChanges,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
  ChartConfiguration,
} from 'chart.js';
import { TemperatureData } from '../../types/weather.types';

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip);

@Component({
  selector: 'app-temperature-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './temperature-widget.component.html',
})
export class TemperatureWidgetComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() data!: TemperatureData;
  @Input() stationName: string = '';
  @Input() stationId: number = 0;

  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  lastUpdated: Date = new Date();
  private chart?: Chart;

  ngAfterViewInit(): void {
    this.buildChart();
  }

  ngOnChanges(): void {
    this.lastUpdated = new Date();
    if (this.chart && this.data) {
      this.chart.data.datasets[0].data = this.data.hourly.map(d => d.temp);
      this.chart.update();
    }
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  get currentTemp(): number  { return this.data?.tempAvg ?? 0; }
  get tempMax(): number      { return this.data?.tempMax ?? 0; }
  get tempMin(): number      { return this.data?.tempMin ?? 0; }
  get feelsLike(): number    { return this.data?.feelsLike ?? 0; }
  get humidity(): number     { return this.data?.humidityPercent ?? 0; }
  get trend()                { return this.data?.trend ?? 'stable'; }

  get trendIcon(): string {
    return { rising: '↑', falling: '↓', stable: '→' }[this.trend];
  }

  get trendLabel(): string {
    return { rising: 'Rising', falling: 'Falling', stable: 'Stable' }[this.trend];
  }

  get trendIconColor(): string {
    return { rising: 'text-red-400', falling: 'text-blue-400', stable: 'text-emerald-400' }[this.trend];
  }

  get tempColorClass(): string {
    if (this.currentTemp <= 5)  return 'text-blue-400';
    if (this.currentTemp <= 15) return 'text-emerald-400';
    if (this.currentTemp <= 25) return 'text-amber-400';
    return 'text-red-400';
  }

  private get accentRgb(): string {
    if (this.currentTemp <= 5)  return '96, 165, 250';
    if (this.currentTemp <= 15) return '52, 211, 153';
    if (this.currentTemp <= 25) return '251, 191, 36';
    return '248, 113, 113';
  }

  private buildChart(): void {
    const ctx = this.chartCanvas?.nativeElement.getContext('2d');
    if (!ctx || !this.data) return;

    const rgb = this.accentRgb;

    const config: ChartConfiguration<'line'> = {
      type: 'line',
      data: {
        labels: this.data.hourly.map(d => d.hour),
        datasets: [{
          data: this.data.hourly.map(d => d.temp),
          borderColor: `rgba(${rgb}, 1)`,
          borderWidth: 2,
          pointBackgroundColor: '#1f2937',
          pointBorderColor: `rgba(${rgb}, 1)`,
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: true,
          backgroundColor: (context) => {
            const { ctx: c, chartArea } = context.chart;
            if (!chartArea) return 'transparent';
            const gradient = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            gradient.addColorStop(0, `rgba(${rgb}, 0.25)`);
            gradient.addColorStop(1, `rgba(${rgb}, 0)`);
            return gradient;
          },
          tension: 0.4,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1f2937',
            borderColor: '#374151',
            borderWidth: 1,
            titleColor: '#9ca3af',
            bodyColor: '#f3f4f6',
            padding: 10,
            callbacks: { label: (item) => ` ${item.raw}°C` },
          },
        },
        scales: {
          x: {
            grid: { color: 'rgba(255,255,255,0.04)' },
            ticks: { color: '#6b7280', font: { family: 'monospace', size: 10 } },
            border: { display: false },
          },
          y: {
            grid: { color: 'rgba(255,255,255,0.04)' },
            ticks: {
              color: '#6b7280',
              font: { family: 'monospace', size: 10 },
              callback: (v) => `${v}°`,
            },
            border: { display: false },
          },
        },
      },
    };

    this.chart = new Chart(ctx, config);
  }
}