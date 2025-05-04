import { TestBed } from '@angular/core/testing';

import { PropositionsDeRattrapageService } from './propositions-de-rattrapage.service';

describe('PropositionsDeRattrapageService', () => {
  let service: PropositionsDeRattrapageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PropositionsDeRattrapageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
