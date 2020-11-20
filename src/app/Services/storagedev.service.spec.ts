import { TestBed } from '@angular/core/testing';
import { StoragedevService } from './storagedev.service';

describe('StoragedevService', () => {
  let service: StoragedevService;
  beforeEach(() =>{ 
    TestBed.configureTestingModule({})
    service = new StoragedevService(null);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it("get worked", () => {
    let result = service.get("qwerty");
    expect(Array.isArray(result)).toBeTruthy;
  });
  it("set worked", () => {
    let result = service.set("global",123);
    expect(Array.isArray(result)).toBeTruthy;
  });
  it("remove worked", () => {
    let result = service.remove("1");
    expect(Array.isArray(result)).toBeTruthy;
  });

});
