import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { patientReview } from 'src/app/core/interfaces/patients';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  isreview = new BehaviorSubject(false)
  updatereview = new BehaviorSubject(false)
  sharedApi: string = "http://127.0.0.1:8000/api";
  // sharedApi: string = "http://medibookidashbord.test/api";

  constructor(private _HttpClient: HttpClient) { }

    //header config
    joinUsHeaders = new HttpHeaders().set('Accept', 'application/json');
    authAcceptHeaders = new HttpHeaders({
      'Accept': 'application/json',
      authorization : `${localStorage.getItem('token')}`
    })
    authHeader = new HttpHeaders({
      authorization : `${localStorage.getItem('token')}`
    })

  createReviewPatient(model: patientReview) {
    return this._HttpClient.post(this.sharedApi + '/patient/DoctorReview', model, { headers: this.authAcceptHeaders });
  }


  updateReviewPatient(model: patientReview) {
    return this._HttpClient.post(this.sharedApi + '/patient/DoctorReview', model, { headers: this.authAcceptHeaders });
  }


  getReviewPatient(id: string):Observable<any> {
    return this._HttpClient.get<any>(`${this.sharedApi}/patient/DoctorReview/${id}`, { headers: this.authAcceptHeaders });
  }
}
