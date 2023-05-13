import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientProfileService {

  constructor(private _HttpClient: HttpClient) { }

  // variables
  // sharedApi: string = "http://127.0.0.1:8000/api";
  sharedApi: string = "http://medibookidashbord.test/api";
  authAcceptHeaders = new HttpHeaders({
    'Accept': 'application/json',
    authorization : `${localStorage.getItem('token')}`
  })
  authHeader = new HttpHeaders({
    authorization : `${localStorage.getItem('token')}`
  })

  changePassword(model:any):Observable<any>{
    return this._HttpClient.post(this.sharedApi + '/patient/change/password', model, {  headers: this.authAcceptHeaders  });
  }

  getDiagnosis(lang: string): Observable<any> {
    this.authHeader = new HttpHeaders({
      authorization : `${localStorage.getItem('token')}`
    })
    return this._HttpClient.get(`${this.sharedApi}/patient/diagnosis?lang=${lang}`,{  headers: this.authHeader  }).pipe(catchError((e: any) => {
      console.log(e)
      return throwError(e)
    }));
  }

  getInsuranceCompanies(lang: string): Observable<any> {
    this.authHeader = new HttpHeaders({
      authorization : `${localStorage.getItem('token')}`
    })
    return this._HttpClient.get(`${this.sharedApi}/insurances?lang=${lang}`,{  headers: this.authHeader  }).pipe(catchError((e: any) => {
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

  getPatientInfo(): Observable<any>{
    this.authHeader = new HttpHeaders({
      authorization : `${localStorage.getItem('token')}`
    })
    return this._HttpClient.get(`${this.sharedApi}/patient/information`,{  headers: this.authHeader  }).pipe(catchError((e: any) => {
      console.log(e)
      return throwError(e)
    }));
  }

  addInsurance(model:any):Observable<any>{
    this.authHeader = new HttpHeaders({
      authorization : `${localStorage.getItem('token')}`
    })
    return this._HttpClient.post(this.sharedApi + '/patient/insurance', model, {  headers: this.authHeader  });
  }


  getInvoices(lang: string): Observable<any> {
    this.authHeader = new HttpHeaders({
      authorization : `${localStorage.getItem('token')}`
    })
    return this._HttpClient.get(`${this.sharedApi}/patient/invoices?lang=${lang}`,{  headers: this.authHeader  }).pipe(catchError((e: any) => {
      console.log(e)
      return throwError(e)
    }));
  }

  getOrders(): Observable<any> {
    this.authHeader = new HttpHeaders({
      authorization : `${localStorage.getItem('token')}`
    })
    return this._HttpClient.get(`${this.sharedApi}/patient/all/orders`,{  headers: this.authHeader  }).pipe(catchError((e: any) => {
      console.log(e)
      return throwError(e)
    }));
  }

  getOrderDetails(id:number, lang:string): Observable<any> {
    this.authHeader = new HttpHeaders({
      authorization : `${localStorage.getItem('token')}`
    })
    return this._HttpClient.get(`${this.sharedApi}/patient/order/detail?id=${id}&lang=${lang}`,{  headers: this.authHeader  }).pipe(catchError((e: any) => {
      console.log(e)
      return throwError(e)
    }));
  }

  getPatientAppointments(lang: string): Observable<any> {
    this.authHeader = new HttpHeaders({
      authorization : `${localStorage.getItem('token')}`
    })
    return this._HttpClient.get(`${this.sharedApi}/patient/book/doctor?lang=${lang}`,{  headers: this.authHeader  }).pipe(catchError((e: any) => {
      console.log(e)
      return throwError(e)
    }));
  }

  getPatientReviews(lang: string): Observable<any> {
    this.authHeader = new HttpHeaders({
      authorization : `${localStorage.getItem('token')}`
    })
    return this._HttpClient.get(`${this.sharedApi}/patient/DoctorReview?lang=${lang}`,{  headers: this.authHeader  }).pipe(catchError((e: any) => {
      console.log(e)
      return throwError(e)
    }));
  }
}
