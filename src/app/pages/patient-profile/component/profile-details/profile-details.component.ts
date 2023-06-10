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
    this._DataService.curruntService.next('details')
    this.getPatientInfo();
    this._DataService.userPhoto.subscribe(res => {
      this.userPhoto = res
    });
    this.getLang();

  }

/*--------------------------------------------------------------(variables)------------------------------- */

  updatePhoto:any;
  updateFormdata?: any;
  userPhoto?:string= "../../../assets/images/user_male.jpeg" ;
  patientInfoAPIres: any;
  patientInfo: any = "";
  patientName?: string;
  lang:string = "en";
  rtlDir:boolean = false;
  direction:string = 'ltr';

   //update profile form
   updateProfile = new FormGroup({
    name: new FormControl("", [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z]{1,}[a-zA-Z0-9]*$/)]),
    phone : new FormControl("", [Validators.required]),
    address : new FormControl("", [Validators.required]),
    photo : new FormControl("", [Validators.required])

  })

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
    this.patientInfoSubscription = this._PatientProfileService.getPatientInfo(this.lang).subscribe({
      next: (patientInfo) => {
        this.patientInfo = patientInfo.data;
        this.patientName = patientInfo.data.name
        console.log(this.patientInfo)
        this.patientInfoAPIres = patientInfo;
        console.log(patientInfo);
        if(this.patientInfo.photo != ''){
          this._DataService.userPhoto.next(this.patientInfo.photo)
          // this.userPhoto = this.patientInfo.photo;
        }
        // this.isVisibleSpinner = false;
        this.updateProfile = new FormGroup({
          name: new FormControl(this.patientInfo.name, [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z]{1,}[a-zA-Z0-9]*$/)]),
          phone : new FormControl(this.patientInfo.phone, [Validators.required]),
          address : new FormControl(this.patientInfo.address, [Validators.required]),
          photo : new FormControl("", [Validators.required])

        })
        //update profile form
        // this.updateProfile = new FormGroup({
        //   name: new FormControl(this.patientName, [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z]{1,}[a-zA-Z0-9]*$/)]),
        //   phone : new FormControl("", [Validators.required]),
        //   address : new FormControl("", [Validators.required])
        // })
      },
      error: (error) => {
        this.patientInfoAPIres = error;
        console.log(error);
      }
    });
  }

  //----- Method 3
  updateProfileSupmit(){
      const model = {
        "photo" : this.updatePhoto,
        "name": this.updateProfile.value.name,
        "phone": this.updateProfile.value.phone,
        "address": this.updateProfile.value.address
      }
      console.log(model)
      this.updateFormdata = new FormData();
      Object.entries(model).forEach(([key , value] : any) => {
        if(key=='name' && value==''){
          this.updateFormdata.append(key , this.patientInfo.name);
        }else if(key=='phone' && value==''){
          this.updateFormdata.append(key , this.patientInfo.phone);
        }else if(key=='address' && value==''){
          this.updateFormdata.append(key , this.patientInfo.address);
        }else{
          this.updateFormdata.append(key , value);
        }
      })
      console.log(this.updateFormdata)
      this._PatientProfileService.updateProfile(this.updateFormdata).subscribe({
        next: (response) => {
          console.log(response);
          this.toastr.success(!this.rtlDir?`profile updated successfully!`:`تم تحديث الملف الشخصي بنجاح`);
          this.getPatientInfo();
        },
        error : (error)=> {
          console.log(error);
        }
      })
  }

   //----- Method 11
   onFileChange(event: any) {
    this.updatePhoto = event.target.files[0];
  }

    
  /*=============================================( Destroying Method )=============================================*/

  ngOnDestroy() {
    this.patientInfoSubscription.unsubscribe();
  }

}
