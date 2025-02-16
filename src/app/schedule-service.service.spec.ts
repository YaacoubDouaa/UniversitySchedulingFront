import { TestBed } from '@angular/core/testing';

import { SalleScheduleServiceService } from './schedule-service.service';

describe('SalleScheduleServiceService', () => {
  let service: SalleScheduleServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalleScheduleServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
