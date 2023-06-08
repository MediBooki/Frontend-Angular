import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SpecializationService {
  _sharedApi: string = environment.apimain;
  // https://benaahadees.com/mediBookiDashbord/public/api
  // _sharedApi: string = "http://127.0.0.1:8000/api";
  idspecialize = new BehaviorSubject<number>(0);

  constructor(private _HttpClient: HttpClient) { }

  getSpecialization(lang: string, page: number,search:string): Observable<any> {
    //get data from local file json
    return this._HttpClient.get<any>(`${this._sharedApi}/sections?lang=${lang}&page=${page}&search=${search}`).pipe(catchError((e: any) => {
      console.log(e)
      return throwError(e)
    }));
  };

  getSpecializeDetails(lang: string , specialistID : number): Observable<any> {
    //get data from local file json
    return this._HttpClient.get<any>(`${this._sharedApi}/sections/${specialistID}?lang=${lang}`).pipe(catchError((e: any) => {
      console.log(e)
      return throwError(e)
    }));
  };

  getAllSpecializations(lang: string): Observable<any> {
    //get data from local file json
    return this._HttpClient.get<any>(`${this._sharedApi}/get/section?lang=${lang}`).pipe(catchError((e: any) => {
      console.log(e)
      return throwError(e)
    }));
  };
}

