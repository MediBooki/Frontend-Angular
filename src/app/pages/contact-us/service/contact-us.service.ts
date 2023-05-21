import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactUsService {

  sharedApi = environment.apimain
  constructor(private http: HttpClient) { }

  contactUs(model: any) {
    return this.http.post(this.sharedApi + '/contacts', model)
  }


}
