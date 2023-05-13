import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Section } from 'src/app/core/interfaces/section';

@Injectable({
  providedIn: 'root'
})
export class DoctorRegisterService {

  // sharedApi: string = "http://127.0.0.1:8000/api";
  sharedApi: string = "http://medibookidashbord.test/api";
  //header config
  joinUsHeaders = new HttpHeaders().set('Accept', 'application/json');
  authAcceptHeaders = new HttpHeaders({
    'Accept': 'application/json',
    authorization : `${localStorage.getItem('token')}`
  })
  authHeader = new HttpHeaders({
    authorization : `${localStorage.getItem('token')}`
  })

  constructor(private _HttpClient: HttpClient) { }


  doctorJoinus(model: any) :Observable<any> {
    return this._HttpClient.post(this.sharedApi + '/doctors', model, {  headers: this.joinUsHeaders  });
  }
}
