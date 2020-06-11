import { TestBed } from '@angular/core/testing';
import { ObservableService } from './observable.service';

describe('ObservableService', () => {
    let service: ObservableService;
    beforeEach(() => {
      TestBed.configureTestingModule({})
      service = new ObservableService();
    });
  
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it("should return a non empty array", () => {
        let result = service.GetAll();
        expect(Array.isArray(result)).toBeTruthy;
      });
    
    it("should return a non empty array", () => {
    let result = service.Watch("test");
    expect(Array.isArray(result)).toBeTruthy;
    });

    it("should return a non empty array", () => {
        let result = service.WatchOnce("test", 1);
        expect(Array.isArray(result)).toBeTruthy;
    });

    it("should return a non empty array", () => {
        let result = service.Set("test","bcz");
        expect(Array.isArray(result)).toBeTruthy;
    });

});