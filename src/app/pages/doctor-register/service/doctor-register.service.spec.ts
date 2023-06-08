import { TestBed } from '@angular/core/testing';
import { SharedModule } from 'src/app/layout/shared/shared.module';
import { DoctorRegisterService } from './doctor-register.service';

describe('DoctorRegisterService', () => {
  let service: DoctorRegisterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[SharedModule]
    });
    service = TestBed.inject(DoctorRegisterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
