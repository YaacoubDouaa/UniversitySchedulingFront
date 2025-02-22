import { TestBed } from '@angular/core/testing';


class RoomsService {
}

describe('RoomsService', () => {
  let service: RoomsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoomsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
