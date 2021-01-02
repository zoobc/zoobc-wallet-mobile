import { TestBed } from '@angular/core/testing';
import { CurrencyService } from './currency.service';

describe('CurrencyService', () => {
  let service: CurrencyService;
  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = new CurrencyService(null, null);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it("set active currency worked", () => {
    let result = service.setActiveCurrency("IDR");
    expect(Array.isArray(result)).toBeTruthy;
  });

  it("set currency rate list worked", () => {
    let result = service.setCurrencyRateList(1);
    expect(Array.isArray(result)).toBeTruthy;
  });

  it("set price in USD worked", () => {
    let result = service.setPriceInUSD(1);
    expect(Array.isArray(result)).toBeTruthy;
  });

  it("set rate worked", () => {
    let result = service.setRate(1);
    expect(Array.isArray(result)).toBeTruthy;
  });

  it("load rate worked", () => {
    let result = service.loadRate();
    expect(Array.isArray(result)).toBeTruthy;
  });
});
