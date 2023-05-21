import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, throwError } from 'rxjs';
import { Login } from 'src/app/core/interfaces/patients';
import { createAccount } from 'src/app/core/interfaces/patients';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  _sharedApi: string = "http://medibookidashbord.test/api";
  // _sharedApi:string = "http://127.0.0.1:8000/api";

  constructor(private http: HttpClient, private router: Router) { }
  AuthlayoutLeft = new BehaviorSubject(false);
  istrigger = new BehaviorSubject(false);
  isLogedIn = new BehaviorSubject(false);

  createPatient(model: createAccount) {
    return this.http.post(this._sharedApi + '/patient/register', model);
  }
  login(model: Login) {
    return this.http.post(this._sharedApi + '/patient/login', model)
  }
  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return token ? true : false;
  }

  forgetPassword(model: Login) {
    return this.http.post(this._sharedApi + '/forget/password', model)
  }

  resetPassword(model: Login) {
    return this.http.post(this._sharedApi + '/reset/password', model)
  }

  // login(username: string, password: string): void {
  //   // your login code here
  //   const token = 'your_token_value';
  //   localStorage.setItem('token', token);
  // }
  logout(): void {
    // your logout code here
    localStorage.removeItem('token');
    localStorage.removeItem('patient_id');
    this.router.navigate(['/home']);
  }

  getTerms(lang: string): Observable<any> {
    return this.http.get(`${this._sharedApi}/terms?lang=${lang}`).pipe(catchError((e: any) => {
      console.log(e)
      return throwError(e)
      }));
  }
}
