import { TestBed } from '@angular/core/testing';
import { FeedbackService } from './feedback.service';

describe('FeedbackService', () => {
  let service: FeedbackService;
  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = new FeedbackService(null);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  
});
