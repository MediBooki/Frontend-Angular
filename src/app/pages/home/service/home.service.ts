import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { DataService } from 'src/app/core/services/data.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  sharedApi:any = environment.apimain;

  constructor(private _HttpClient: HttpClient, private _DataService: DataService) { }

  getSliderImages(lang: string): Observable<any> {
     
    return this._HttpClient.get(`${this.sharedApi}/sliders?lang=${lang}`).pipe(catchError((e: any) => {
       
      return throwError(e)
      }));
  }

  getDistinguishedDoctors(lang: string): Observable<any> {
    return this._HttpClient.get<any[]>(`${this.sharedApi}/best/doctors?lang=${lang}`).pipe(catchError((e: any) => {
       
      return throwError(e)
    }));
  }

  getCounterVals(): Observable<any> {
     
    return this._HttpClient.get(`${this.sharedApi}/counts`).pipe(catchError((e: any) => {
       
      return throwError(e)
      }));
  }
}
