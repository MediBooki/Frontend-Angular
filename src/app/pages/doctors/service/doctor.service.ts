import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  sharedApi: string = environment.apimain;

  constructor(private _HttpClient: HttpClient) { }




  getFilteredDoctors(model: any, lang: string, page: number): Observable<any> {

    let params = new HttpParams();

    for (let obj in model) {
       
      if (typeof (model[obj]) == 'object') {
         
        model[obj].forEach((arr: string) => {
          params = params.append(`${obj}[]`, arr);
        })
      } else {
        params = params.append(`${obj}`, model[obj]);
      }

    }

    // const parse = JSON.parse(par)
     
    //  
    return this._HttpClient.get<any[]>(`${this.sharedApi}/filter/doctors?lang=${lang}&page=${page}`, { params: params }).pipe(catchError((e: any) => {
       
      return throwError(e)
    }));

  }
}
