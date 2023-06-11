import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Route, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription, of } from 'rxjs';
import { AppointmentsService } from 'src/app/pages/appointments/service/appointments.service';
import { DataService } from '../services/data.service';
import { PatientProfileService } from 'src/app/pages/patient-profile/service/patient-profile.service';

@Injectable({
  providedIn: 'root'
})
export class ReviewGuard implements CanActivate {
  doctorId :any
  AppointmentsSubscription:Subscription = new Subscription();
  private appointmentData: any;
  istrue!:Boolean

    // API Variables
    appointmentSubscription :Subscription = new Subscription();
    doctor: any = {}

  constructor(private _AppointmentsService:AppointmentsService ,private router:Router ,private toastr: ToastrService,private _DataService:DataService,private _PatientProfileService:PatientProfileService){

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return new Observable<boolean>((observer) => {
        this._DataService._lang.subscribe({next:(language)=>{
          // to get all diagnosis
            this.AppointmentsSubscription = this._PatientProfileService.getPatientAppointments(language).subscribe({
            next: (Appointments) => {
              this.appointmentData = Appointments.data;
              this.doctorId = route.paramMap.get('id')
              const currentDate = new Date();
              let flag = true
              this.appointmentData?.forEach((appointment:any) => {
                const appointmentDate = new Date(appointment.date); 
                if(appointment.doctor.id === parseInt(this.doctorId)  && (appointmentDate) <= (currentDate) && appointment.status === 1  ){
                  observer.next(true);
                  observer.complete(); 
                  flag = false    
                }else{
                  flag = true     
                } 
              });
              if(flag){
                flag=false
                this.appointmentSubscription = this._AppointmentsService.getDoctorById(language, this.doctorId).subscribe({
                  next: (Doctor) => {
      
                    this.doctor = Doctor.data;
                     
                    this.toastr.error(`You must attend an examination for this doctor`)
                    this.router.navigate(['/appointments/'+this.doctorId])

                    // this.isVisibleSpinner = false;
                  },
                  error: (error) => {
                    this.toastr.error("There is no such doctor on the site");
                    this.router.navigate(['/doctors'])
                    // this.isVisibleSpinner = false;
                  }
                });
                observer.next(false);
                observer.complete();
              }  
            }
            });
          }});
      })

  }
  
}
