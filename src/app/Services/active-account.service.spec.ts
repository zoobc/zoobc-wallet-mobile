import { TestBed } from '@angular/core/testing';

import { ActiveAccountService } from './active-account.service';

describe('ActiveAccountService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ActiveAccountService = TestBed.get(ActiveAccountService);
    expect(service).toBeTruthy();
  });
});
