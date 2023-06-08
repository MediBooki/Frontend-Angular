import { TestBed } from '@angular/core/testing';
import { SharedModule } from 'src/app/layout/shared/shared.module';
// import { SpecializationsService } from './specializations.service';
import { SpecializationService } from './specializations.service';

describe('SpecializationsService', () => {
  let service: SpecializationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[SharedModule]
    });
    service = TestBed.inject(SpecializationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
