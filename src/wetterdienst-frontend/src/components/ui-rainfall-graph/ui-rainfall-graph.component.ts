import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export interface RainfallData {
  month: string;
  rainfall: number | null;
}

@Component({
  selector: 'app-ui-rainfall-graph',
  standalone: true,
  templateUrl: './ui-rainfall-graph.component.html',
})
export class UiRainfallGraphComponent implements OnInit {
  @Input() data: RainfallData[] = [];

  @ViewChild('myChart', { static: true }) canvasRef!: ElementRef;

  ngOnInit(): void {
    new Chart(this.canvasRef.nativeElement, {
      type: 'line',
      data: {
        labels: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
        datasets: [{
          label: 'Niederschlag (mm)',
          data: this.data.map(d => d.rainfall),
          fill: true,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          pointBackgroundColor: '#3b82f6',
          spanGaps: true
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { title: { display: true, text: 'mm' } },
          x: { title: { display: true, text: 'Monat' } }
        }
      }
    });
  }
}