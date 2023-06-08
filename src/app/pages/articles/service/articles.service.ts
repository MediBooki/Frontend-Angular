import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

  // sharedApi: string = "http://127.0.0.1:8000/api";
  sharedApi: string = environment.apimain;

  constructor(private _HttpClient: HttpClient) { }

  getArticales(lang: string, limt?:number,page?:number): Observable<any> {
    console.log(`${this.sharedApi}/blogs?lang=${lang}&page=${page}&limit=${limt}`);
    if(limt == undefined){
      return this._HttpClient.get(`${this.sharedApi}/blogs?lang=${lang}&page=${page}`).pipe(catchError((e: any) => {
      console.log(e)
      return throwError(e)
      }));
    }else{
      return this._HttpClient.get(`${this.sharedApi}/blogs?lang=${lang}&page=${page}&limit=${limt}`).pipe(catchError((e: any) => {
        console.log(e)
        return throwError(e)
        }));
    }
  }

  getOneArticale(lang: string, id:number): Observable<any> {
    return this._HttpClient.get(`${this.sharedApi}/blogs/${id}?lang=${lang}`).pipe(catchError((e: any) => {
    console.log(e)
    return throwError(e)
    }));
  }
}
