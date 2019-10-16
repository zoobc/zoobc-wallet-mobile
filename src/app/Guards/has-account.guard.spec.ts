import { TestBed, async, inject } from '@angular/core/testing';

import { HasAccountGuard } from './has-account.guard';

describe('HasAccountGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HasAccountGuard]
    });
  });

  it('should ...', inject([HasAccountGuard], (guard: HasAccountGuard) => {
    expect(guard).toBeTruthy();
  }));
});
