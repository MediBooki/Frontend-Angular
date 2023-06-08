import { TestBed } from '@angular/core/testing';
import { SharedModule } from 'src/app/layout/shared/shared.module';
import { ArticlesService } from './articles.service';

describe('ArticlesService', () => {
  let service: ArticlesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[SharedModule]
    });
    service = TestBed.inject(ArticlesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
