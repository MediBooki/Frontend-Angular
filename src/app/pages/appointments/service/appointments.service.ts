import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subscription, catchError, throwError } from 'rxjs';
import { AppointmentsPatient } from 'src/app/core/interfaces/patients';
import { environment } from 'src/environments/environment';
import { PatientProfileService } from '../../patient-profile/service/patient-profile.service';
import { DataService } from 'src/app/core/services/data.service';

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {
  // _sharedApi: string = "http://127.0.0.1:8000/api";

  _sharedApi: string = environment.apimain
  private appointmentData: any;
  AppointmentsSubscription = new Subscription();
  

  constructor(private _HttpClient: HttpClient , private _PatientProfileService:PatientProfileService,private _DataService:DataService) { 
    this.getAppointmentData()
  }

  // General Method to Create Authorization Header
  createAuthorizationHeader(headers: HttpHeaders) {
    return headers.append('Authorization', localStorage.getItem("token")!);
  }

  getDoctorById(lang: string, id: any): Observable<any> {
    //get data from local file json
    return this._HttpClient.get<any>(`${this._sharedApi}/doctors/${id}?lang=${lang}`).pipe(catchError((e: any) => {
       
      return throwError(e)
    }));
  };

  createAppointmentPatient(model: AppointmentsPatient) {
    let headers = new HttpHeaders();
    headers = this.createAuthorizationHeader(headers);
    return this._HttpClient.post(this._sharedApi + '/patient/book/doctor', model, { headers: headers });
  }

  getBookDoctorList(): Observable<any> {
    let headers = new HttpHeaders();
    headers = this.createAuthorizationHeader(headers);
    return this._HttpClient.get(this._sharedApi + '/patient/book/doctor', { headers: headers });
  }

  getAllTimeBookeed(model :any): Observable<any> {
    let params = new HttpParams();

    for (let obj in model) {
        params = params.append(`${obj}`, model[obj]);
    }
    return this._HttpClient.get(this._sharedApi + '/check/appointment', { params: params });
  }



  getAppointmentData() {
    this._DataService._lang.subscribe({next:(language)=>{
      // to get all diagnosis
        this.AppointmentsSubscription = this._PatientProfileService.getPatientAppointments(language).subscribe({
        next: (Appointments) => {
          this.appointmentData = Appointments.data;
           
        }
        });
      }});
    // this.appointmentData = data;
    return this.appointmentData
  }
  
  
  // getAppointmentData() {
  //    
  //   return this.appointmentData;
  // }
}
