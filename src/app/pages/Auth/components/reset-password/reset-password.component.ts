import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DataService } from 'src/app/core/services/data.service';
import { ToastrService } from 'ngx-toastr';
import { group } from '@angular/animations';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit, OnDestroy  {

  
  isVisibleSpinner: boolean = false;

  lang: string = "en";
  rtlDir: boolean = false;
  direction: any = 'ltr';
  passwordType: string = 'password';
  showPassword:boolean=false
  showConfirmPassword:boolean=false
  password!:any
  confirmPassword!:any

  resetPasswordForm!: FormGroup

  // API Subscriptions Variables
  resetPasswordSubscription = new Subscription();


  constructor(private fb: FormBuilder, private router: Router, private _AuthService: AuthService, private _DataService: DataService, private toastr:ToastrService) {
  }

  ngOnInit(): void {
    this.getLang()
    this.createForm()
  }
  isSmallScreen = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isSmallScreen = window.innerWidth < 576; // Adjust the breakpoint as needed
  }

  getLang() {
    this._DataService._lang.subscribe({
      next: (language) => {
        this.lang = language;
        if (language == 'en') {
          this.rtlDir = false;
          this.direction='ltr';
        } else {
          this.rtlDir = true;
          this.direction='rtl';
        }
      }
    })
  }

  createForm() {
    this.resetPasswordForm = this.fb.group({
      resetPassword : new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)]),
      resetConfirmPassword : new FormControl('', Validators.required),
      
    },{validators:this.checkPassword})
  }
  forgetPassword() {
    const model: any = {
      email: localStorage.getItem("email_patient"),
      token : localStorage.getItem("reset_token"),
      password: this.resetPasswordForm.value.resetPassword,
      password_confirmation: this.resetPasswordForm.value.resetConfirmPassword,

    }
    this.isVisibleSpinner = true;
 
    this.resetPasswordSubscription = this._AuthService.resetPassword(model).subscribe((res: any) => {
      // this._DataService.is_login.next(true);
      this.toastr.success(!this.rtlDir?`The password has been changed successfully`:`تم تغيير الباسورد بنجاح`)
      this.isVisibleSpinner = false;
      localStorage.removeItem("reset_token")
      localStorage.removeItem("email_patient")
      this.router.navigate(['/Login'])
    }, (error) => {
      this.toastr.error(!this.rtlDir?`password is incorrect`:`كلمة المرور خاطئة` )
      this.isVisibleSpinner = false;
    })
  }


  checkPassword:ValidatorFn=(group:AbstractControl):ValidationErrors|null =>{
    this.password = group.get("resetPassword")?.value;
    this.confirmPassword = group.get("resetConfirmPassword")?.value;

    return this.password === this.confirmPassword ? null : {notSame : true}
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  
  /*=============================================( Destroying Method )=============================================*/

  ngOnDestroy() {
    this.resetPasswordSubscription.unsubscribe();
  }
}
