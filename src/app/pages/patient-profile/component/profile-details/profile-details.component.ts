import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';
import { PatientProfileService } from '../../service/patient-profile.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss']
})
export class ProfileDetailsComponent implements OnInit, OnDestroy {
  // constructor & dependency injection
  constructor( private _DataService:DataService, private _PatientProfileService:PatientProfileService, private toastr: ToastrService ,  private router: Router) { }

  ngOnInit(): void {
    this._DataService.firstSectionHeight = 0;
    this.getPatientInfo();
    this._DataService.userPhoto.subscribe(res => {
      this.userPhoto = res
    });
    this.getLang();

  }

/*--------------------------------------------------------------(variables)------------------------------- */


  userPhoto?:string= "../../../assets/images/user_male.jpeg" ;
  patientInfoAPIres: any;
  patientInfo: any = "";
  patientName?: string;
  lang:string = "en";
  rtlDir:boolean = false;
  direction:string = 'ltr';


  // API Subscriptions Variables
  patientInfoSubscription = new Subscription();

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
  getPatientInfo(){
    this._PatientProfileService.checkIfUpdate.subscribe(()=>{
      this.patientInfoSubscription = this._PatientProfileService.getPatientInfo(this.lang).subscribe({
        next: (patientInfo) => {
          this.patientInfo = patientInfo.data;
          this.patientName = patientInfo.data.name
           
          this.patientInfoAPIres = patientInfo;
           
          if(this.patientInfo.photo != ''){
            this._DataService.userPhoto.next(this.patientInfo.photo)
          }
  
          // to show modal in parent
          this._PatientProfileService.emitDetailsChange({
            info:patientInfo
          })
      
        },
        error: (error) => {
          this.patientInfoAPIres = null;
           
        }
      });
    })
    
  }

  
    
  /*=============================================( Destroying Method )=============================================*/

  ngOnDestroy() {
    this.patientInfoSubscription.unsubscribe();
  }

}
