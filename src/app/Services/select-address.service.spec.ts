import { TestBed } from '@angular/core/testing';

import { SelectAddressService } from './select-address.service';

describe('SelectAddressService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SelectAddressService = TestBed.get(SelectAddressService);
    expect(service).toBeTruthy();
  });
});
