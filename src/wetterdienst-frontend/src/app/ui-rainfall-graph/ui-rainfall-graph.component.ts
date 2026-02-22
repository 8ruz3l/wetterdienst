import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ui-rainfall-graph',
  templateUrl: './ui-rainfall-graph.component.html',
  styleUrls: ['./ui-rainfall-graph.component.scss']
})
export class UiRainfallGraphComponent {
  @Input()
  data: string | undefined | null
}
