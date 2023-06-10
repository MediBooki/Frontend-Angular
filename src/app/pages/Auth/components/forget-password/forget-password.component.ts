import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DataService } from 'src/app/core/services/data.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit, OnDestroy  {

  
  // API Subscriptions Variables
  forgetPasswordSubscription = new Subscription();

  isVisibleSpinner: boolean = false;

  lang: string = "en";
  rtlDir: boolean = false;
  direction: any = 'ltr';
 
  forgetPasswordForm!: FormGroup

  constructor(private fb: FormBuilder, private router: Router, private _AuthService: AuthService, private _DataService: DataService, private toastr:ToastrService) {
  }

  ngOnInit(): void {
    this.createForm()
    this.getLang()
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
    this.forgetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z0-9]{2,}@[a-z]{3,10}\.(com|net|org)$/)]],
      
    })
  }
  forgetPassword() {
    const model: any = {
      email: this.forgetPasswordForm.value.email,
    }
    this.isVisibleSpinner = true;
    this.forgetPasswordSubscription = this._AuthService.forgetPassword(model).subscribe((res: any) => {
      // console.log(res);
      localStorage.setItem("reset_token", res.reset_token)
      localStorage.setItem("email_patient", this.forgetPasswordForm.value.email)
      // this._DataService.is_login.next(true);
      this.toastr.success(!this.rtlDir?`please check your email`:`تفقد بريدك الالكتروني من فضلك`)
      this.isVisibleSpinner = false;
    }, (error) => {
      this.toastr.error(!this.rtlDir?`Email not found`:`البريد الالكتروني غير موجود`)
      console.log(error)
      this.isVisibleSpinner = false;
    })
    console.log(this.forgetPasswordForm.value)
  }

      /*=============================================( Destroying Method )=============================================*/

      ngOnDestroy() {
        this.forgetPasswordSubscription.unsubscribe();
      }

}
