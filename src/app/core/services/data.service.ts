import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Doctor, reviewDoctor } from '../interfaces/doctor';
import { Section } from '../interfaces/section';
import { Medicine } from '../interfaces/medicine';
import { MedicineCategory } from '../interfaces/medicine-category';
import { Appointments } from '../interfaces/appointments';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  defaultNoImg:string = "../../../assets/images/No_Image_Available.png"
  curruntService = new BehaviorSubject("details")

  userPhoto= new BehaviorSubject('../../../assets/images/user_male.jpeg')
  firstSectionHeight: any = 0; // variable to know first component section height to show scrollToTop Btn
  _lang = new BehaviorSubject(this.getLocalLang());
  sharedApi: string = "http://127.0.0.1:8000/api";
  // sharedApi: string = "http://medibookidashbord.test/api";
  isPageLoaded = new BehaviorSubject(false);
  idReview = new BehaviorSubject<number>(0);
  is_login = new BehaviorSubject(localStorage.getItem('token')!=null);
  constructor(private _HttpClient: HttpClient) { }
  //  http://127.0.0.1:8000/api/doctors?lang=ar&page=1

  //header config
  joinUsHeaders = new HttpHeaders().set('Accept', 'application/json');
  authAcceptHeaders = new HttpHeaders({
    'Accept': 'application/json',
    authorization : `${localStorage.getItem('token')}`
  })
  authHeader = new HttpHeaders({
    authorization : `${localStorage.getItem('token')}`
  })

  getLocalLang() {
    if (localStorage.getItem('lang') != null) {
      if (localStorage.getItem('lang') == 'en') {
        return 'en'
      } else {
        return 'ar'
      }
    } else {
      localStorage.setItem('lang', 'en');
      return 'en'
    }
  }


  getDoctors(lang: string, page: number): Observable<any> {
    // const url = `${this.sharedApi}/doctors?lang=${lang}&page=${page}`;
    return this._HttpClient.get<Doctor[]>(`${this.sharedApi}/doctors?lang=${lang}&page=${page}`).pipe(catchError((e: any) => {
      console.log(e)
      return throwError(e)
    }));
  }

  getMedicines(lang: string, page: number): Observable<any> {
    return this._HttpClient.get<Medicine[]>(`${this.sharedApi}/medicines?lang=${lang}&page=${page}`).pipe(catchError((e: any) => {
      console.log(e)
      return throwError(e)
    }));
  }

  getFilteredMedicines(model: any, lang: string, page: number): Observable<any> {

    let params = new HttpParams();

    for (let obj in model) {
      console.log(typeof (model[obj]))
      if (typeof (model[obj]) == 'object') {
        console.log(typeof (model[obj]) == 'object');
        model[obj].forEach((gg: string) => {
          params = params.append(`${obj}[]`, gg);
        })
      } else {
        params = params.append(`${obj}`, model[obj]);
      }

    }

    // const parse = JSON.parse(par)
    console.log(model.genders)
    // console.log(params)
    return this._HttpClient.get<Medicine[]>(`${this.sharedApi}/medicines?lang=${lang}&page=${page}`, { params: params }).pipe(catchError((e: any) => {
      console.log(e)
      return throwError(e)
    }));

  }


  getSpecificMedicine(MedicineId: number, lang: string): Observable<any> {
    console.log("id is " + MedicineId + " and lang is " + lang)
    return this._HttpClient.get<Medicine>(`${this.sharedApi}/medicines/${MedicineId}?lang=${lang}`).pipe(catchError((e: any) => {
      console.log(e)
      return throwError(e)
    }));
  }

  getSections(lang: string): Observable<any> {
    return this._HttpClient.get<Section[]>(`${this.sharedApi}/sections?lang=${lang}`).pipe(catchError((e: any) => {
      console.log(e)
      return throwError(e)
    }));
  }

  getCategories(lang: string): Observable<any> {
    return this._HttpClient.get<MedicineCategory[]>(`${this.sharedApi}/categories?lang=${lang}`).pipe(catchError((e: any) => {
      console.log(e)
      return throwError(e)
    }));
  }

  getAppointments(lang: string): Observable<any> {
    return this._HttpClient.get<Appointments[]>(`${this.sharedApi}/appointments?lang=${lang}`).pipe(catchError((e: any) => {
      console.log(e)
      return throwError(e)
    }));
  }





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




  getDistinguishedDoctors(lang: string): Observable<any> {
    return this._HttpClient.get<any[]>(`${this.sharedApi}/best/doctors?lang=${lang}`).pipe(catchError((e: any) => {
      console.log(e)
      return throwError(e)
    }));
  }



  getOneArticale(lang: string, id:number): Observable<any> {
    return this._HttpClient.get(`${this.sharedApi}/blogs/${id}?lang=${lang}`).pipe(catchError((e: any) => {
    console.log(e)
    return throwError(e)
    }));
  }

  getCounterVals(): Observable<any> {
    return this._HttpClient.get(`${this.sharedApi}/counts`).pipe(catchError((e: any) => {
      console.log(e)
      return throwError(e)
      }));
  }
}
