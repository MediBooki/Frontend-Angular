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
  AppointmentsSubscription = new Subscription();
  private appointmentData: any;
  istrue!:Boolean

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
              let flag = false
              this.appointmentData?.forEach((appointment:any) => {
                const appointmentDate = new Date(appointment.date); 
                if(appointment.doctor.id === parseInt(this.doctorId)  && (appointmentDate) <= (currentDate)  ){
                  observer.next(true);
                  observer.complete(); 
                  flag = false    
                }else{
                  flag = true     
                } 
              });
              if(flag){
                flag=false
                this.toastr.error(`please book this doctor to review this doctor`)
                this.router.navigate(['/appointments/'+this.doctorId])
                observer.next(false);
                observer.complete();
              }  
            }
            });
          }});
      })

  }
  
}
