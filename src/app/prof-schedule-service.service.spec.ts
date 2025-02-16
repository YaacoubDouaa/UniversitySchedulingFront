import { TestBed } from '@angular/core/testing';

import { ProfScheduleServiceService } from './prof-schedule-service.service';

describe('ProfScheduleServiceService', () => {
  let service: ProfScheduleServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfScheduleServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
