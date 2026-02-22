import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiRainfallGraphComponent } from './ui-rainfall-graph.component';

describe('UiRainfallGraphComponent', () => {
  let component: UiRainfallGraphComponent;
  let fixture: ComponentFixture<UiRainfallGraphComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UiRainfallGraphComponent]
    });
    fixture = TestBed.createComponent(UiRainfallGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
