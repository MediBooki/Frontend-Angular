import { DataService } from 'src/app/core/services/data.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/pages/Auth/services/auth.service';
import { ReviewService } from 'src/app/pages/review/service/review.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
import { Subscription } from 'rxjs';
import { Medicine } from 'src/app/core/interfaces/medicine';
import { CartService } from 'src/app/pages/cart/service/cart.service';
import { PatientProfileService } from '../../service/patient-profile.service';
import { AppointmentsService } from 'src/app/pages/appointments/service/appointments.service';
import { reviews } from 'src/app/core/interfaces/patients';

@Component({
  selector: 'app-patient-profile',
  templateUrl: './patient-profile.component.html',
  styleUrls: ['./patient-profile.component.scss']
})
export class PatientProfileComponent implements OnInit{
  // constructor & dependency injection
  constructor(private _AuthService: AuthService,private _AppointmentsService:AppointmentsService ,private _ReviewService:ReviewService, private _DataService:DataService, private _PatientProfileService:PatientProfileService, private toastr: ToastrService ,  protected router: Router,private route: ActivatedRoute,private _cartservice : CartService) { }

  // on init
  ngOnInit(): void {
    this.getLang();
    this.getAppointmentModal();
    this.getInvoicesModal();
    this.getDetailsModal();
  }

  /*=============================================( Variables )=============================================*/
  lang:string = "en";
  rtlDir:boolean = false;
  direction:string = 'ltr';
  is_login: boolean= false;
  islogsub = this._DataService.is_login.subscribe(res => {
    this.is_login = res
  });

  // update profile details variables
  patientInfo: any = "";
  updatePhoto:any;
  updateFormdata?: any;

  /*=============================================( Component Created Methods )=============================================*/

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

  // -----------------------------------------------appointments modal----------------------------------------------- //

  myAppointmentModal:{appointments:any[],id:number,review:boolean,updateReview:boolean,reviewId:number} = {
    appointments:[],
    id:0,
    review:false,
    updateReview:false,
    reviewId:0
  }

  getAppointmentModal() {
    this._PatientProfileService.changeAppointmentEmitted$.subscribe(response => {
      this.myAppointmentModal = response;
      console.log(this.myAppointmentModal)
    });
  }


  // -----------------------------------------------details modal----------------------------------------------- //

  
  getDetailsModal() {
    this._PatientProfileService.changeDetailsEmitted$.subscribe(response => {
      this.patientInfo = response.info.data;
       

      this.updateProfile = new FormGroup({
      name: new FormControl(this.patientInfo.name, [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z]{1,}[a-zA-Z0-9]*$/)]),
      phone : new FormControl(this.patientInfo.phone, [Validators.required]),
      address : new FormControl(this.patientInfo.address, [Validators.required]),
      photo : new FormControl("", [Validators.required])

      })
    });
  }

    //update profile form
    updateProfile = new FormGroup({
    name: new FormControl("", [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z]{1,}[a-zA-Z0-9]*$/)]),
    phone : new FormControl("", [Validators.required]),
    address : new FormControl("", [Validators.required]),
    photo : new FormControl("", [Validators.required])

  })


  //----- Method 3
  updateProfileSupmit(){
    const model = {
      "photo" : this.updatePhoto,
      "name": this.updateProfile.value.name,
      "phone": this.updateProfile.value.phone,
      "address": this.updateProfile.value.address
    }
     
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
     
    this._PatientProfileService.updateProfile(this.updateFormdata).subscribe({
      next: (response) => {
         
        this.toastr.success(!this.rtlDir?`profile updated successfully!`:`تم تحديث الملف الشخصي بنجاح`);
        // this.getPatientInfo();
        this._PatientProfileService.checkIfUpdate.next(!this._PatientProfileService.checkIfUpdate.value)
      },
      error : (error)=> {
         
      }
    })
  }

  //----- Method 11
  onFileChange(event: any) {
    this.updatePhoto = event.target.files[0];
  }




  // -----------------------------------------------invoice modal----------------------------------------------- //

  myInvoicesModal:{invoices:any[],id:number} = {
    invoices:[],
    id:0
  }

  getInvoicesModal() {
    this._PatientProfileService.changeInvoiceEmitted$.subscribe(response => {
       
      this.myInvoicesModal = response;
       
       
    });
  }

  //----- Method 6
  getifUpdate(check :number){
    check == 1 ? localStorage.setItem('updatereview', JSON.stringify(true)) : localStorage.setItem('updatereview', JSON.stringify(false));
  }
}



