import { TestBed } from '@angular/core/testing';
import { AppointmentsPatient } from 'src/app/core/interfaces/patients';
import { AppointmentsService } from './appointments.service';
import { HttpClientModule, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule,HttpTestingController } from '@angular/common/http/testing';
import { SharedModule } from 'src/app/layout/shared/shared.module';
describe('AppointmentsService', () => {
  let service: AppointmentsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientModule,HttpClientTestingModule,SharedModule]
    });
    service = TestBed.inject(AppointmentsService);
    httpMock = TestBed.inject(HttpTestingController)
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should return the doctor with the given id', () => { 
    service.getDoctorById('en', 1).subscribe(doctor => { 
      expect(doctor.id).toBe(1); 
    }); 
  });
  it('should throw an error if the id is not found', () => { 
    service.getDoctorById('en', 0).subscribe( 
      () => {}, 
      error => { 
        expect(error).toBeTruthy(); 
      } 
    ); 
  }); 
  it('should create an appointment for a patient', () => {
    const model: AppointmentsPatient = {
      patient_id: 0,
      doctor_id: 0,
      price: 0,
      date: "",
      time: ''
    };
    service.createAppointmentPatient(model).subscribe((res) => {
       
      expect(res).toBeTruthy();
      expect(res).toBe(200);
      expect(res).toEqual(model);
    });

  });
  
});
