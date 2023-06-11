import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  sharedApi = environment.apimain
  defaultNoImg:string = "../../../assets/images/No_Image_Available.png"
  userPhoto= new BehaviorSubject('../../../assets/images/user_male.jpeg')
  firstSectionHeight: any = 0; // variable to know first component section height to show scrollToTop Btn
  _lang = new BehaviorSubject(this.getLocalLang());
  isPageLoaded = new BehaviorSubject(false);
  idReview = new BehaviorSubject<number>(0);
  is_login = new BehaviorSubject(localStorage.getItem('token')!=null);
  constructor(private _HttpClient: HttpClient) { }
  //  http://127.0.0.1:8000/api/doctors?lang=ar&page=1

  //header config
  joinUsHeaders = new HttpHeaders().set('Accept', 'application/json');

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

  getCounterVals(): Observable<any> {
    return this._HttpClient.get(`${this.sharedApi}/counts`).pipe(catchError((e: any) => {
      console.log(e)
      return throwError(e)
      }));
  }


  gethospitalDetails(): Observable<any> {
    console.log(`${this.sharedApi}/settings`)
    return this._HttpClient.get<any[]>(`${this.sharedApi}/settings`).pipe(catchError((e: any) => {
      console.log(e)
      return throwError(e)
    }));
  }

  getAllTenants(): Observable<any> {
    return this._HttpClient.get<any[]>(`${this.sharedApi}/tenants`).pipe(catchError((e: any) => {
      console.log(e)
      return throwError(e)
    }));
  }

}
