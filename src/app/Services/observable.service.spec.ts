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

    it("get all worked", () => {
        let result = service.GetAll();
        expect(Array.isArray(result)).toBeTruthy;
      });
    
    it("watch worked", () => {
    let result = service.Watch("test");
    expect(Array.isArray(result)).toBeTruthy;
    });

    it("wathc one worked", () => {
        let result = service.WatchOnce("test", 1);
        expect(Array.isArray(result)).toBeTruthy;
    });

    it("set worked", () => {
        let result = service.Set("test","bcz");
        expect(Array.isArray(result)).toBeTruthy;
    });

    it("push worked", () => {
        let result = service.Push(1,1);
        expect(Array.isArray(result)).toBeTruthy;
      });

      it("get multiple worked", () => {
        let result = service.GetMultiple([1,2,3,4,5]);
        expect(Array.isArray(result)).toBeTruthy;
      });

});