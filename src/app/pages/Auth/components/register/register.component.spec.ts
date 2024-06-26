import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/layout/shared/shared.module';
import { AppModule } from 'src/app/app.module';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let toastrService: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['createPatient']);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);

    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: ToastrService, useValue: toastrSpy },
      ],
      imports: [ReactiveFormsModule, SharedModule,AppModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    toastrService = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;

    // Initialize authService.istrigger with a BehaviorSubject
    const istriggerSubject = new BehaviorSubject<boolean>(false);
    authService.istrigger = istriggerSubject;
  });



  it('should submit the patient registration form successfully', fakeAsync(() => {
    // Mock patientForm value
    const email = 'test@example.com';
    const password = 'password123';
    const username = 'John Doe';
    const dateOfBirth = new Date('1990-01-01');
    const phoneNumber = '1234567890';
    const gender = 'male';
    const bloodGroup = 'A+';
    const address = '123 Main St';
  
    component.patientForm.setValue({
      email,
      password,
      confirmPassword: password,
      username,
      date_of_birth: dateOfBirth,
      phoneNumber,
      gender,
      blood_group: bloodGroup,
      address,
      terms_conditions: true,
    });
  
    // Mock AuthService.createPatient to return a successful response
    const createPatientResponse = { success: true };
    authService.createPatient.and.returnValue(of(createPatientResponse));
  
    // Trigger the submit function
    component.submit();
    tick();
    fixture.whenStable().then(() => {
    // Expectations
    expect(authService.createPatient).toHaveBeenCalledWith({
      email,
      password,
      name: username,
      date_of_birth: dateOfBirth,
      phone: phoneNumber,
      gender,
      blood_group: bloodGroup,
      address,
    });
    expect(toastrService.success).toHaveBeenCalledWith('patient Added Successfully');
    // expect(router.navigate).toHaveBeenCalledWith(['/Login']);
  });
  }));
  

  it('should handle patient registration error', fakeAsync(() => {
    // Mock patientForm value
    const email = 'test@example.com';
    const password = 'password123';
    const username = 'John Doe';
    const dateOfBirth = new Date('1990-01-01');
    const phoneNumber = '1234567890';
    const gender = 'male';
    const bloodGroup = 'A+';
    const address = '123 Main St';

    component.patientForm.setValue({
      email,
      password,
      confirmPassword: password,
      username,
      date_of_birth: dateOfBirth,
      phoneNumber,
      gender,
      blood_group: bloodGroup,
      address,
      terms_conditions: true,
    });

    // Create a mock error response
    const errorResponse = {
      error: {
        errors: {
          email: ['Email is already taken'],
        },
      },
    };
    authService.createPatient.and.returnValue(throwError(errorResponse));

    // Trigger the submit function
    component.submit();
    tick();
    fixture.whenStable().then(() => {
    // Expectations
    expect(authService.createPatient).toHaveBeenCalledWith({
      email,
      password,
      // confirmPassword,
      name: username,
      date_of_birth: dateOfBirth,
      phone: phoneNumber,
      gender,
      blood_group: bloodGroup,
      address,
      // terms_conditions: true,
    });
    expect(toastrService.error).toHaveBeenCalledWith('Email is already taken');
  });
  }));
  afterEach(() => {
    TestBed.resetTestingModule(); // Reset the testing module after each test
    fixture.destroy(); 
  });
});

