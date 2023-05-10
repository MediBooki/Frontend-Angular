import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpecializationService {
  _sharedApi: string = "http://medibookidashbord.test/api";
  // _sharedApi: string = "http://127.0.0.1:8000/api";

  constructor(private _HttpClient: HttpClient) { }

  getSpecialization(lang: string, page: number): Observable<any> {
    //get data from local file json
    return this._HttpClient.get<any>(`${this._sharedApi}/sections?lang=${lang}&page=${page}`).pipe(catchError((e: any) => {
      console.log(e)
      return throwError(e)
    }));
  };
}

