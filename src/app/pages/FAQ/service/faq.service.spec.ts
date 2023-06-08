import { TestBed } from '@angular/core/testing';
import { SharedModule } from 'src/app/layout/shared/shared.module';
import { FaqService } from './faq.service';

describe('FaqService', () => {
  let service: FaqService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[SharedModule]
    });
    service = TestBed.inject(FaqService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
