import { TestBed, inject } from '@angular/core/testing';
import { ReviewGuard } from './review.guard';
import { AppointmentsService } from 'src/app/pages/appointments/service/appointments.service';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../services/data.service';
import { PatientProfileService } from 'src/app/pages/patient-profile/service/patient-profile.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { SharedModule } from 'src/app/layout/shared/shared.module';
import { AppModule } from 'src/app/app.module';
import { ActivatedRouteSnapshot, ParamMap, RouterStateSnapshot, convertToParamMap } from '@angular/router';

describe('ReviewGuard', () => {
  let guard: ReviewGuard;
  let appointmentsService: AppointmentsService;
  let toastrService: ToastrService;
  let dataService: DataService;
  let patientProfileService: PatientProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule,SharedModule,AppModule],
      providers: [
        ReviewGuard,
        AppointmentsService,
        ToastrService,
        DataService,
        PatientProfileService
      ]
    });

    guard = TestBed.inject(ReviewGuard);
    appointmentsService = TestBed.inject(AppointmentsService);
    toastrService = TestBed.inject(ToastrService);
    dataService = TestBed.inject(DataService);
    patientProfileService = TestBed.inject(PatientProfileService);
  });

  afterEach(() => {
    // Clean up any subscriptions or mocks here
    guard.AppointmentsSubscription.unsubscribe();
    guard.appointmentSubscription.unsubscribe();
  });

  it('should allow activation if there are past appointments for the specified doctor', (done) => {
    const language = new BehaviorSubject<string>('en');
    const appointmentsData = {
      data: [
        { doctor: { id: 1 }, date: new Date('2023-01-01') }, // Past appointment
        { doctor: { id: 2 }, date: new Date('2023-06-01') }, // Future appointment
      ],
    };
    spyOn(dataService._lang, 'asObservable').and.returnValue(language.asObservable());
    spyOn(patientProfileService, 'getPatientAppointments').and.returnValue(of(appointmentsData));
  
    const paramMap = convertToParamMap({ id: '1' }); // Create ParamMap object
  
    const route = new ActivatedRouteSnapshot();
    const activatedRouteSnapshot = {
      ...route,
      paramMap: paramMap as ParamMap, // Assign the desired paramMap
    } as ActivatedRouteSnapshot;

    // (route as any).paramMap = paramMap as ParamMap; // Assign paramMap using a type assertion
  
    const state = {} as RouterStateSnapshot;
  
    const result = guard.canActivate(activatedRouteSnapshot, state) as Observable<boolean>;
  
    result.subscribe((value) => {
      expect(value).toBeTrue();
      done();
    });
  });
  
  it('should navigate to appointments page and show error toastr if there are no past appointments for the specified doctor', (done) => {
    const language = new BehaviorSubject<string>('en');
    const appointmentsData = {
      data: [{ doctor: { id: 2 }, date: new Date('2023-06-01') }], // Future appointment
    };
    spyOn(dataService._lang, 'asObservable').and.returnValue(language.asObservable());
    spyOn(patientProfileService, 'getPatientAppointments').and.returnValue(of(appointmentsData));
    spyOn(appointmentsService, 'getDoctorById').and.returnValue(of({ data: { id: 1 } }));
  
    const paramMap = convertToParamMap({ id: '1' }); // Create ParamMap object
  
    const route = new ActivatedRouteSnapshot();
    const activatedRouteSnapshot = {
      ...route,
      get paramMap() {
        return paramMap as ParamMap; // Return the desired paramMap
      },
    } as ActivatedRouteSnapshot;
  
    const state = {} as RouterStateSnapshot;
  
    spyOn(toastrService, 'error');
    spyOn(guard['router'], 'navigate');
  
    const result = guard.canActivate(activatedRouteSnapshot, state) as Observable<boolean>;
  
    result.subscribe((value) => {
      expect(value).toBeFalse();
      expect(toastrService.error).toHaveBeenCalledWith('please book this doctor to review this doctor');
      expect(guard['router'].navigate).toHaveBeenCalledWith(['/appointments/1']);
      done();
    });
  });

  // Add more test cases to cover different scenarios

});



