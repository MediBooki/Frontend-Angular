import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, throwError } from 'rxjs';
import { Medicine } from 'src/app/core/interfaces/medicine';
import { MedicineCategory } from 'src/app/core/interfaces/medicine-category';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PharmacyService {

  sharedApi: string = environment.apimain;
  favoritesId = new BehaviorSubject<number[]>([]); // medicines IDs added to favorite
  // General Method to Create Authorization Header
  createAuthorizationHeader(headers: HttpHeaders) {
    return headers.append('Authorization', localStorage.getItem("token")!);
  }
  constructor(private _HttpClient: HttpClient) { }

  getFilteredMedicines(model: any, lang: string, page: number): Observable<any> {

    let params = new HttpParams();

    for (let obj in model) {
      console.log(typeof (model[obj]))
      if (typeof (model[obj]) == 'object') {
        console.log(typeof (model[obj]) == 'object');
        model[obj].forEach((arr: string) => {
          params = params.append(`${obj}[]`, arr);
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


  
  // add medicine to favorite
  addFavorite(medicineId:number):Observable<any> {
    const model = {
      "medicine_id": medicineId
    }
    let headers = new HttpHeaders();
    headers = this.createAuthorizationHeader(headers);
    return this._HttpClient.post(this.sharedApi + `/patient/wishlist/medicine` , model , {headers: headers})
  }

  // remove medicine from favorite
  removeFavorite(medicineId:number):Observable<any> {
    let headers = new HttpHeaders();
    headers = this.createAuthorizationHeader(headers);
    return this._HttpClient.delete(this.sharedApi + `/patient/wishlist/medicine/${medicineId}` , {headers: headers})
  }

  // return all favorited medicines
  getAllFavorite(lang: string):Observable<any> {
    let headers = new HttpHeaders();
    headers = this.createAuthorizationHeader(headers);
    return this._HttpClient.get(this.sharedApi + `/patient/wishlist/medicine?lang=${lang}` , {headers: headers})
  }

}
