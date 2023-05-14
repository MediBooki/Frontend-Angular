import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  sharedApi: string = "http://medibookidashbord.test/api";

  constructor(private _HttpClient: HttpClient) { }


  gethospitalDetails(): Observable<any> {
    return this._HttpClient.get<any[]>(`${this.sharedApi}/settings`).pipe(catchError((e: any) => {
      console.log(e)
      return throwError(e)
    }));
  }


  getFilteredDoctors(model: any, lang: string, page: number): Observable<any> {

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
    return this._HttpClient.get<any[]>(`${this.sharedApi}/filter/doctors?lang=${lang}&page=${page}`, { params: params }).pipe(catchError((e: any) => {
      console.log(e)
      return throwError(e)
    }));

  }
}
