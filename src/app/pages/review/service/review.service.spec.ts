import { TestBed } from '@angular/core/testing';
import { SharedModule } from 'src/app/layout/shared/shared.module';
import { ReviewService } from './review.service';

describe('ReviewService', () => {
  let service: ReviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[SharedModule]
    });
    service = TestBed.inject(ReviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
