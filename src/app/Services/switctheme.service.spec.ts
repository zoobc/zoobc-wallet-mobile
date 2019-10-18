import { TestBed } from '@angular/core/testing';

import { SwitcthemeService } from './switctheme.service';

describe('SwitcthemeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SwitcthemeService = TestBed.get(SwitcthemeService);
    expect(service).toBeTruthy();
  });
});
