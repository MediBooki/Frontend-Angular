import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpResponse } from '@angular/common/http';
import { CheckoutGuard } from './checkout.guard';
import { SharedModule } from 'src/app/layout/shared/shared.module';

describe('CheckoutGuard', () => {
  let guard: CheckoutGuard;
  let httpTestingController: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,SharedModule]
    });
    guard = TestBed.inject(CheckoutGuard);
    httpTestingController = TestBed.inject(HttpTestingController);

  });
  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
