import { TestBed } from '@angular/core/testing';

import { SetupPinService } from './setup-pin.service';

describe('SetupPinService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SetupPinService = TestBed.get(SetupPinService);
    expect(service).toBeTruthy();
  });
});
