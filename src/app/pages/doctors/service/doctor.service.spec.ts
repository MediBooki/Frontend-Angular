import { TestBed } from '@angular/core/testing';
import { SharedModule } from 'src/app/layout/shared/shared.module';
import { DoctorService } from './doctor.service';

describe('DoctorService', () => {
  let service: DoctorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[SharedModule]
    });
    service = TestBed.inject(DoctorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
