import { TestBed } from '@angular/core/testing';
import { UtilService } from './util.service';

describe('UtilService', () => {
  let service; UtilService;
  beforeEach(() =>  { 
    TestBed.configureTestingModule({})
    service = new UtilService(null, null, null, null, null);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it("should return a non empty array", () => {
    let result = service.copySuccess();
    expect(Array.isArray(result)).toBeTruthy;
  });

  it("should return a non empty array", () => {
    let result = service.generateSeed(1234, 4567);
    expect(Array.isArray(result)).toBeTruthy;
  });
});
