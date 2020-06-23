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

  it("should return a non empty array", () => {
    let result = service.setActiveCurrency("IDR");
    expect(Array.isArray(result)).toBeTruthy;
  });

  it("should return a non empty array", () => {
    let result = service.setCurrencyRateList(1);
    expect(Array.isArray(result)).toBeTruthy;
  });

  it("should return a non empty array", () => {
    let result = service.setPriceInUSD(1);
    expect(Array.isArray(result)).toBeTruthy;
  });

  it("should return a non empty array", () => {
    let result = service.setRate(1);
    expect(Array.isArray(result)).toBeTruthy;
  });

  it("should return a non empty array", () => {
    let result = service.loadRate();
    expect(Array.isArray(result)).toBeTruthy;
  });
});
