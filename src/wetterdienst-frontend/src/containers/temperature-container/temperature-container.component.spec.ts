import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemperatureContainerComponent } from './temperature-container.component';

describe('TemperatureContainerComponent', () => {
  let component: TemperatureContainerComponent;
  let fixture: ComponentFixture<TemperatureContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemperatureContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemperatureContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
