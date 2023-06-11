import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PatientProfileService {

  constructor(private _HttpClient: HttpClient) { }

  // variables
  // sharedApi: string = "http://127.0.0.1:8000/api";
  sharedApi: string = environment.apimain;

  /*---------------------------------(Modals Trigger)--------------------------------- */

  private emitAppointmentChangeSource = new Subject<any>();
  changeAppointmentEmitted$ = this.emitAppointmentChangeSource.asObservable();
  emitAppointmentChange(change: any) {
      this.emitAppointmentChangeSource.next(change);
  }  
  
  private emitInvoiceChangeSource = new Subject<any>();
  changeInvoiceEmitted$ = this.emitInvoiceChangeSource.asObservable();
  emitInvoiceChange(change: any) {
      this.emitInvoiceChangeSource.next(change);
  }  

  private emitDetailsChangeSource = new Subject<any>();
  changeDetailsEmitted$ = this.emitDetailsChangeSource.asObservable();
  emitDetailsChange(change: any) {
      this.emitDetailsChangeSource.next(change);
  }  


  checkIfUpdate = new BehaviorSubject(false)

  authAcceptHeaders = new HttpHeaders({
    'Accept': 'application/json',
    authorization : `${localStorage.getItem('token')}`
  })

  // General Method to Create Authorization Header
  createAuthorizationHeader(headers: HttpHeaders) {
    return headers.append('Authorization', localStorage.getItem("token")!);
  }

  changePassword(model:any):Observable<any>{
    return this._HttpClient.post(this.sharedApi + '/patient/change/password', model, {  headers: this.authAcceptHeaders  });
  }

  getDiagnosis(lang: string): Observable<any> {
    // this.authHeader = new HttpHeaders({
    //   authorization : `${localStorage.getItem('token')}`
    // })
    let headers = new HttpHeaders();
    headers = this.createAuthorizationHeader(headers);
    return this._HttpClient.get(`${this.sharedApi}/patient/diagnosis?lang=${lang}`,{  headers: headers  }).pipe(catchError((e: any) => {
      console.log(e)
      return throwError(e)
    }));
  }

  getInsuranceCompanies(lang: string): Observable<any> {
    let headers = new HttpHeaders();
    headers = this.createAuthorizationHeader(headers);
    return this._HttpClient.get(`${this.sharedApi}/insurances?lang=${lang}`,{  headers: headers  }).pipe(catchError((e: any) => {
      console.log(e)
      return throwError(e)
    }));
  }

  updateProfile(model:any):Observable<any> {
    this.authAcceptHeaders = new HttpHeaders({
      'Accept': 'application/json',
      authorization : `${localStorage.getItem('token')}`
    })
    return this._HttpClient.post(this.sharedApi + '/patient/update/information', model, {  headers: this.authAcceptHeaders  });
  }

  getPatientInfo(lang:string): Observable<any>{
    let headers = new HttpHeaders();
    headers = this.createAuthorizationHeader(headers);
    return this._HttpClient.get(`${this.sharedApi}/patient/information?lang=${lang}`,{  headers: headers  }).pipe(catchError((e: any) => {
      console.log(e)
      return throwError(e)
    }));
  }

  addInsurance(model:any):Observable<any>{
    let headers = new HttpHeaders();
    headers = this.createAuthorizationHeader(headers);
    return this._HttpClient.post(this.sharedApi + '/patient/insurance', model,{  headers: headers  });
  }


  getInvoices(lang: string): Observable<any> {
    let headers = new HttpHeaders();
    headers = this.createAuthorizationHeader(headers);
    return this._HttpClient.get(`${this.sharedApi}/patient/invoices?lang=${lang}`,{  headers: headers  }).pipe(catchError((e: any) => {
      console.log(e)
      return throwError(e)
    }));
  }

  getOrders(): Observable<any> {
    let headers = new HttpHeaders();
    headers = this.createAuthorizationHeader(headers);
    return this._HttpClient.get(`${this.sharedApi}/patient/all/orders`,{  headers: headers  }).pipe(catchError((e: any) => {
      console.log(e)
      return throwError(e)
    }));
  }

  getOrderDetails(id:number, lang:string): Observable<any> {
    let headers = new HttpHeaders();
    headers = this.createAuthorizationHeader(headers);
    return this._HttpClient.get(`${this.sharedApi}/patient/order/detail?id=${id}&lang=${lang}`,{  headers: headers  }).pipe(catchError((e: any) => {
      console.log(e)
      return throwError(e)
    }));
  }

  getPatientAppointments(lang: string): Observable<any> {
    // this.authHeader = new HttpHeaders({
    //   authorization : `${localStorage.getItem('token')}`
    // })
    let headers = new HttpHeaders();
    headers = this.createAuthorizationHeader(headers);
    return this._HttpClient.get(`${this.sharedApi}/patient/book/doctor?lang=${lang}`,{  headers: headers  }).pipe(catchError((e: any) => {
      console.log(e)
      return throwError(e)
    }));
  }

  getPatientReviews(lang: string): Observable<any> {
    let headers = new HttpHeaders();
    headers = this.createAuthorizationHeader(headers);
    return this._HttpClient.get(`${this.sharedApi}/patient/DoctorReview?lang=${lang}`,{  headers: headers  }).pipe(catchError((e: any) => {
      console.log(e)
      return throwError(e)
    }));
  }
}
