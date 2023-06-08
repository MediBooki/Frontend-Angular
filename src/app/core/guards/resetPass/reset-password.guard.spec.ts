import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpResponse } from '@angular/common/http';
import { ResetPasswordGuard } from './reset-password.guard';
import { SharedModule } from 'src/app/layout/shared/shared.module';


describe('ResetPasswordGuard', () => {
  let guard: ResetPasswordGuard;
  let httpTestingController: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,SharedModule],
    });
    guard = TestBed.inject(ResetPasswordGuard);
    httpTestingController = TestBed.inject(HttpTestingController);

  });
  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
