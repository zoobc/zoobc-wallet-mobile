import { TestBed } from '@angular/core/testing';
import { NetworkService } from './network.service';

describe('NetworkService', () => {
  let service: NetworkService;
  
  beforeEach(() => { 
    TestBed.configureTestingModule({})
  service = new NetworkService(null);
});

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it("get network worked", () => {
    let result = service.getNetwork();
    expect(Array.isArray(result)).toBeTruthy;
  });

  it("set network worked", () => {
    let result = service.setNetwork(1);
    expect(Array.isArray(result)).toBeTruthy;
  });

  it("broadcast network worked", () => {
    let result = service.broadcastSelectNetwork(1);
    expect(Array.isArray(result)).toBeTruthy;
  });

});
