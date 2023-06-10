import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginComponent } from './login.component';
import { SharedModule } from 'src/app/layout/shared/shared.module';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { AppModule } from 'src/app/app.module';

// Create a mock router object
class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

// Create a mock DataService
class MockDataService {
  is_login = {
    next: jasmine.createSpy('next'),
  };
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let toastrService: jasmine.SpyObj<ToastrService>;
  let router: MockRouter;
  let dataService: MockDataService;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['login']);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);
    // const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authSpy },
        { provide: ToastrService, useValue: toastrSpy },
        { provide: MockRouter, useClass: MockRouter }, // Provide the mock router
        { provide: MockDataService, useClass: MockDataService }, // Provide the mock data service
      ],
      imports: [SharedModule, ReactiveFormsModule,AppModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    toastrService = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
    router = TestBed.inject(MockRouter) as MockRouter; // Inject the mock router
    dataService = TestBed.inject(MockDataService) as MockDataService; // Inject the mock data service
  });

  it('should call login API and perform successful login', () => {
    // Mock loginForm value
    const email = 'test@example.com';
    const password = 'password123';
    component.loginForm.setValue({ email, Password: password });

    // Mock AuthService.login to return a successful response
    const loginResponse: any = {
      data: {
        token: 'test-token',
        id: 'test-patient-id',
      },
    };
    authService.login.and.returnValue(of(loginResponse));

    const setItemSpy = spyOn(localStorage, 'setItem').and.callThrough();
    const removeItemSpy = spyOn(localStorage, 'removeItem').and.callThrough();
    // const navigateSpy = spyOn(router, 'navigate');
    // Trigger the login function
    component.login();



    // Expectations
    expect(authService.login).toHaveBeenCalledWith({ email, password });
    // Perform the test and assertions
    expect(setItemSpy).toHaveBeenCalledWith('token', 'Bearer test-token');
    expect(setItemSpy).toHaveBeenCalledWith('patient_id', 'test-patient-id');
    expect(removeItemSpy).toHaveBeenCalledWith('reset_token');
    expect(removeItemSpy).toHaveBeenCalledWith('email_patient');
    // expect(navigateSpy).toHaveBeenCalledWith(['/home']);
    expect(toastrService.success).toHaveBeenCalledWith(
      !component.rtlDir ? 'Signed in successfully' : 'تم تسجيل الدخول بنجاح'
    );
    expect(toastrService.error).not.toHaveBeenCalled();
  });

  it('should handle login error', async () => {
    // Mock loginForm value
    const email = 'test@example.com';
    const password = 'password123';
    component.loginForm.setValue({ email, Password: password });
  
    // Create a mock error response
    const errorResponse = {
      error: {
        data: {
          error: 'Invalid credentials',
        },
      },
    };
    authService.login.and.returnValue(throwError(errorResponse));
  
  
    // Trigger the login function
    component.login();
  
    // Expectations
    expect(authService.login).toHaveBeenCalledWith({ email, password });
    expect(localStorage.setItem).not.toHaveBeenCalled;
    expect(localStorage.removeItem).not.toHaveBeenCalled;
    expect(router.navigate).not.toHaveBeenCalled;
    expect(toastrService.error).toHaveBeenCalledWith(
      !component.rtlDir ? `Email Or Password is incorrect` : `البريد الالكتروني او كلمة المرور خاطئة`,
      errorResponse.error.data.error
    );
  });
  

  afterEach(() => {
    fixture.destroy();
  });
});
