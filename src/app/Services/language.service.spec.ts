import { TestBed } from '@angular/core/testing';
import { LanguageService } from './language.service';

describe('Language Service', () => {
    let service: LanguageService;
    beforeEach(() => {
      TestBed.configureTestingModule({})
      service = new LanguageService(null, null, null);
    });
  
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

  });