import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;
  beforeEach(() =>{ 
    TestBed.configureTestingModule({})
    service = new StorageService(null);
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
