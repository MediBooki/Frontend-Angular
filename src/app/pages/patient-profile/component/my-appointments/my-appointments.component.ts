import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';
import { PatientProfileService } from '../../service/patient-profile.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-my-appointments',
  templateUrl: './my-appointments.component.html',
  styleUrls: ['./my-appointments.component.scss']
})
export class MyAppointmentsComponent implements OnInit, OnDestroy {
  // constructor & dependency injection
  constructor(private _DataService:DataService, private _PatientProfileService:PatientProfileService, private toastr: ToastrService ,  private router: Router) { }

  ngOnInit(): void {
    this.getLang();
    this.getLang();
    this.getAppointments();
    this.getPatientReviews();
  }

/*--------------------------------------------------------------(variables)------------------------------- */
  lang:string = "en";
  rtlDir:boolean = false;
  direction:string = 'ltr';

  AppointmentCurruntColNum:number = 1;
  appointmentColDataIndex:number =0
  updateReviewBtn!:boolean
  reviewBtn!:boolean
  reviewId?:number
  Appointments:any[]=[];
  AppointmentsAPIres:any;
  allAppointment_notempty?:boolean=true;
  allPatientReviews:any[]=[];
  PatientReviewsAPIres:any;

  // API Subscriptions Variables
  AppointmentsSubscription = new Subscription();
  PatientReviewsSubscription = new Subscription();


/*--------------------------------------------------------------(methods)--------------------------------- */

  //----- Method 1
  // Setting Direction
  getLang() {
    this._DataService._lang.subscribe({next:(language)=>{
      this.lang = language;

      if(language == 'en')
      {
        this.rtlDir = false;
        this.direction = 'ltr';
      } else {
        this.rtlDir = true;
        this.direction = 'rtl';
      }
    }})
  }

  //----- Method 2
  nextcolAppointment(){
    if(this.AppointmentCurruntColNum<4){
      this.AppointmentCurruntColNum++;
    }else{
      this.AppointmentCurruntColNum=1;
    }
     
  }

  //----- Method 3
  previousColAppointment(){
    if(this.AppointmentCurruntColNum>1){
      this.AppointmentCurruntColNum--;
    }else{
      this.AppointmentCurruntColNum=4;
    }
     
  }

  //----- Method 4
  appointmentGetColData(i:number , id:number , Dateapp:string){
    this.appointmentColDataIndex = i;
     
    const date = new Date(Dateapp)
    const currentDate = new Date();

    if(this.allPatientReviews.find(r => r.doctor.id  === id ) && currentDate >= date  ){
      this.reviewId = this.allPatientReviews.find(r => r.doctor.id  === id )?.id
       
       
      this.updateReviewBtn=true
      this.reviewBtn = false
      this._DataService.idReview.next(this.allPatientReviews.find(r=> r.doctor.id == id )!.id)
       
    }else if(currentDate >= date && !this.allPatientReviews.find(r => r.doctor.id  === id )){
      this.updateReviewBtn=false
      this.reviewBtn = true
    }else{
      this.updateReviewBtn=false
      this.reviewBtn = false
    }

    // to show modal in parent
    this._PatientProfileService.emitAppointmentChange({
      appointments:this.Appointments,
      id:this.appointmentColDataIndex,
      review:this.reviewBtn,
      updateReview:this.updateReviewBtn,
      reviewId:this.reviewId
    })
  }

  //----- Method 5
  getAppointments(){
    this._DataService._lang.subscribe({next:(language)=>{
    // to get all diagnosis
      this.AppointmentsSubscription = this._PatientProfileService.getPatientAppointments(language).subscribe({
      next: (Appointments) => {
        this.Appointments = Appointments.data;
        this.AppointmentsAPIres = Appointments;
        this.allAppointment_notempty = this.Appointments.length > 0;
        // this._AppointmentsService.setAppointmentData(this.Appointments)
         
      },
      error: (error) => {
        this.AppointmentsAPIres = null;
        this.allAppointment_notempty = false
         
      }
      });
    }});
  }


   //----- Method 7
   getPatientReviews(){
    this._DataService._lang.subscribe({next:(language)=>{
    // to get all PatientReviews
      this.PatientReviewsSubscription = this._PatientProfileService.getPatientReviews(language).subscribe({
      next: (PatientReviews) => {
        this.allPatientReviews = PatientReviews.data;
        this.PatientReviewsAPIres = PatientReviews;
         
      },
      error: (error) => {
        this.PatientReviewsAPIres = error;
         
      }
      });
    }});
  }

    
  /*=============================================( Destroying Method )=============================================*/

  ngOnDestroy() {
    this.AppointmentsSubscription.unsubscribe();
    this.PatientReviewsSubscription.unsubscribe();
  }

}
