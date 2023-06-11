import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';
import { PatientProfileService } from '../../service/patient-profile.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit, OnDestroy {

  // API Subscriptions Variables
  changePasswordSubscription = new Subscription();

  // constructor & dependency injection
  constructor(private _DataService:DataService, private _PatientProfileService:PatientProfileService, private toastr: ToastrService ,  private router: Router) { }

  ngOnInit(): void {
    this.getLang();
  }

  /*--------------------------------------------------------------(variables)------------------------------- */
  //change password form
  changePassword = new FormGroup({
    old_password: new FormControl("", [Validators.required]),
    password : new FormControl("", [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/)]),
    password_confirmation : new FormControl("", [Validators.required]),
    showpasscont : new FormControl()
  })

  lang:string = "en";
  rtlDir:boolean = false;
  direction:string = 'ltr';
  showPass: boolean = false;
/*--------------------------------------------------------------(methods)------------------------------- */
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
  changePasswordFun(){
     
    if(this.changePassword.valid){
      if(this.changePassword.controls.password_confirmation.value == this.changePassword.controls.password.value){
        const model = {
          "old_password": this.changePassword.value.old_password,
          "password": this.changePassword.value.password,
          "password_confirmation": this.changePassword.value.password_confirmation
        }
        this.changePasswordSubscription = this._PatientProfileService.changePassword(model).subscribe({
          next: (response) => {
             
            this.toastr.success(!this.rtlDir?`Password changed successfully!`:`تم تغيير كلمة المرور بنجاح`);
            this.router.navigate(['/home']);
          },
          error : (error)=> {
             
            if(error.error.data == 'wrong old password'){
              this.toastr.error(!this.rtlDir?`Wrong old password`:`كلمة المرور الحالية خاطئة` )
            }
          }
        })
      }else{
        this.toastr.error(!this.rtlDir?`Password confirmation and password doesn't match`:`تأكيد كلمة المرور وكلمة المرور غير متطابقين` );
      }
    }
  }

  //----- Method 3
  showPassword(){
    this.showPass = this.changePassword.value.showpasscont
  }

  
  /*=============================================( Destroying Method )=============================================*/

  ngOnDestroy() {
    this.changePasswordSubscription.unsubscribe();
  }
}
