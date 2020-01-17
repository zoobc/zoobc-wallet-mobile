import { TestBed } from '@angular/core/testing';

import { TransactionFeesService } from './transaction-fees.service';

describe('TransactionFeesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TransactionFeesService = TestBed.get(TransactionFeesService);
    expect(service).toBeTruthy();
  });
});
