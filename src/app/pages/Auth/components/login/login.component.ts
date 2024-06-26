import { error } from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NavigationStart, Router } from '@angular/router';
import { DataService } from 'src/app/core/services/data.service';
import { Login, LoginResponse } from 'src/app/core/interfaces/patients';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy  {
  
  
  // API Subscriptions Variables
  loginSubscription = new Subscription();

  constructor(private fb: FormBuilder, private router: Router, private _AuthService: AuthService, private _DataService: DataService, private toastr:ToastrService) {
   }
  loginForm!: FormGroup
  lang: string = "en";
  rtlDir: boolean = false;
  direction: any = 'ltr';

  passwordType: string = 'password';
  isVisibleSpinner: boolean = false;


  isSmallScreen = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isSmallScreen = window.innerWidth < 576; // Adjust the breakpoint as needed
  }


  ngOnInit(): void {
    this._DataService.firstSectionHeight = 0;
    this.createForm();
    this.getLang()
  }
  // when view load completely
  // ngAfterViewInit() {
  //   setTimeout(() => {
  //     Promise.resolve().then(() => this._DataService.isPageLoaded.next(true))
  //   }, 0);
  // }

  createForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]{1,}.*[a-zA-Z0-9]{1,}@[a-z]{2,}\.[a-zA-Z]{2,}$/)]],
      Password: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)]]
    })
  }
  login() {
    const model: Login = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.Password
    }
    this.isVisibleSpinner = true;
    this.loginSubscription = this._AuthService.login(model).subscribe((res: any) => {
      localStorage.setItem("token", "Bearer " + res.data.token)
      localStorage.setItem("patient_id", res.data.id)
      this._DataService.is_login.next(true);
      localStorage.removeItem("reset_token")
      localStorage.removeItem("email_patient")
      this.router.navigate(['/home'])
      this.toastr.success(!this.rtlDir?`Signed in successfully`:`تم تسجيل الدخول بنجاح`)
      this.isVisibleSpinner = false;
    }, (error) => {
      this.toastr.error(!this.rtlDir?`Email Or Password is incorrect`:`البريد الالكتروني او كلمة المرور خاطئة`,error.error.data.error )
      this.isVisibleSpinner = false;
    })
  }

  getLang() {
    this._DataService._lang.subscribe({
      next: (language) => {
        this.lang = language;
        if (language == 'en') {
          this.rtlDir = false;
        } else {
          this.rtlDir = true;
        }
      }
    })
  }

  togglePassword(){
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
  }


  /*=============================================( Destroying Method )=============================================*/

  ngOnDestroy() {
    this.loginSubscription.unsubscribe();
  }

}
