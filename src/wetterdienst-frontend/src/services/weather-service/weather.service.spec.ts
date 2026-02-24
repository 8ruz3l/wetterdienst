import { TestBed } from '@angular/core/testing';
import { DwdApiService } from './weather.service';



describe('DwdApiService', () => {
  let service: DwdApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DwdApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
