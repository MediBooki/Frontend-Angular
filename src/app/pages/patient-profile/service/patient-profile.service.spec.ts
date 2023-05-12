import { TestBed } from '@angular/core/testing';

import { PatientProfileService } from './patient-profile.service';

describe('PatientProfileService', () => {
  let service: PatientProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatientProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
