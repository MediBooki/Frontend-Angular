import { TestBed } from '@angular/core/testing';
import { SharedModule } from 'src/app/layout/shared/shared.module';
import { ContactUsService } from './contact-us.service';

describe('ContactUsService', () => {
  let service: ContactUsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[SharedModule]
    });
    service = TestBed.inject(ContactUsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
