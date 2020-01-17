import { TestBed, async, inject } from "@angular/core/testing";

import { AuthStorageGuard } from "./auth-storage.guard";

describe("AuthStorageGuard", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthStorageGuard]
    });
  });

  it("should ...", inject([AuthStorageGuard], (guard: AuthStorageGuard) => {
    expect(guard).toBeTruthy();
  }));
});
