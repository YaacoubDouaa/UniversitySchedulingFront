import { TestBed } from '@angular/core/testing';

import { SpecializedCsvParserService } from './specialized-csv-parser.service';

describe('SpecializedCsvParserService', () => {
  let service: SpecializedCsvParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpecializedCsvParserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
