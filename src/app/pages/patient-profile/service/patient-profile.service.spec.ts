import { TestBed } from '@angular/core/testing';
import { SharedModule } from 'src/app/layout/shared/shared.module';
import { PatientProfileService } from './patient-profile.service';

describe('PatientProfileService', () => {
  let service: PatientProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[SharedModule]
    });
    service = TestBed.inject(PatientProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
