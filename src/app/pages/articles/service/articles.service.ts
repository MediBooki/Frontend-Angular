import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

  sharedApi: string = "http://127.0.0.1:8000/api";
  // sharedApi: string = "http://medibookidashbord.test/api";

  constructor(private _HttpClient: HttpClient) { }

  getArticales(lang: string, limt?:number): Observable<any> {
    console.log(`${this.sharedApi}/blogs?lang=${lang}&limit=${limt}`);
    if(limt == undefined){
      return this._HttpClient.get(`${this.sharedApi}/blogs?lang=${lang}`).pipe(catchError((e: any) => {
      console.log(e)
      return throwError(e)
      }));
    }else{
      return this._HttpClient.get(`${this.sharedApi}/blogs?lang=${lang}&limit=${limt}`).pipe(catchError((e: any) => {
        console.log(e)
        return throwError(e)
        }));
    }
  }
}
