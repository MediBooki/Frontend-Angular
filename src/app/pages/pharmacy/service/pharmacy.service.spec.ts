import { TestBed } from '@angular/core/testing';
import { SharedModule } from 'src/app/layout/shared/shared.module';
import { PharmacyService } from './pharmacy.service';

describe('PharmacyService', () => {
  let service: PharmacyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[SharedModule]
    });
    service = TestBed.inject(PharmacyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
