import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  sharedApi: string = "http://medibookidashbord.test/api";

  constructor(private _HttpClient: HttpClient) { }

  getSliderImages(lang: string): Observable<any> {
    return this._HttpClient.get(`${this.sharedApi}/sliders?lang=${lang}`).pipe(catchError((e: any) => {
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
}