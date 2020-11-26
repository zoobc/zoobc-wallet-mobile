import { TestBed } from '@angular/core/testing';
import { LanguageService } from './language.service';

describe('Language Service', () => {
    let service: LanguageService;
    beforeEach(() => {
      TestBed.configureTestingModule({})
      service = new LanguageService(null, null);
    });
  
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

//     it("set initial app language worked", () => {
//     let result = service.setInitialAppLanguage();
//     expect(Array.isArray(result)).toBeTruthy;
//   });

    it("get one worked", () => {
    let result = service.getOne("ID");
    expect(Array.isArray(result)).toBeTruthy;
  });

  });