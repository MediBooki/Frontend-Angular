import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Medicine } from 'src/app/core/interfaces/medicine';
import { MedicineCategory } from 'src/app/core/interfaces/medicine-category';

@Injectable({
  providedIn: 'root'
})
export class PharmacyService {

  sharedApi: string = "http://127.0.0.1:8000/api";
  // sharedApi: string = "http://medibookidashbord.test/api";

  constructor(private _HttpClient: HttpClient) { }

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

  getCategories(lang: string): Observable<any> {
    return this._HttpClient.get<MedicineCategory[]>(`${this.sharedApi}/categories?lang=${lang}`).pipe(catchError((e: any) => {
      console.log(e)
      return throwError(e)
    }));
  }
}
