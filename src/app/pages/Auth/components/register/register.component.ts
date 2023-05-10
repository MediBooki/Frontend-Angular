import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { createAccount } from 'src/app/core/interfaces/patients';
import { AuthService } from '../../services/auth.service';
import { DatePipe } from '@angular/common';
import { DataService } from 'src/app/core/services/data.service';
// import { BsLocaleService } from 'ngx-bootstrap/datepicker';
// import { defineLocale } from 'ngx-bootstrap/chronos';
// import { arLocale } from 'ngx-bootstrap/locale';






@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [DatePipe]
})
export class RegisterComponent implements OnInit {
  @ViewChild('modalBtn') myButton: ElementRef | undefined;
  patientForm!: FormGroup;
  patients: any[] = [];
  isLogin!: boolean;

  username!: FormControl;
  email!: FormControl;
  phoneNumber!: FormControl;
  password!: FormControl;
  confirmPassword!: FormControl;
  date_of_birth!: FormControl;
  gender!: FormControl;
  address!: FormControl;
  blood_group!: FormControl;
  lang: string = "en";
  rtlDir: boolean = false;

  passwordType: string = 'password';
  showPassword:boolean=false
  showConfirmPassword:boolean=false



  constructor(private fb: FormBuilder, private router: Router, private _AuthService: AuthService, private _DataService: DataService) {

  }

  ngOnInit(): void {
    // this.localeService.use('ar');
    this.initFormControl()
    this.createForm();
    Promise.resolve().then(() => this._DataService.isPageLoaded.next(false));
    Promise.resolve().then(() => this._AuthService.isLogedIn.next(false));
    Promise.resolve().then(() => this._AuthService.AuthlayoutLeft.next(false));
    this.getLang();
  }

  // setLocale() {
  //   defineLocale('ar', arLocale); // define the Arabic locale
  //   this.localeService.use('ar');
  //   console.log(this.localeService) // set the Arabic locale as the default locale
  // }

  // when view load completely
  ngAfterViewInit() {
    setTimeout(() => {
      Promise.resolve().then(() => this._DataService.isPageLoaded.next(true))
    }, 0);
  }


  initFormControl() {
    this.username = new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z]{1,}$/)]),
      this.email = new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z0-9]{2,}@[a-z]{3,10}\.(com|net|org)$/)]),
      this.phoneNumber = new FormControl('', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]),
      this.password = new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)]),
      this.confirmPassword = new FormControl('', Validators.required),
      this.date_of_birth = new FormControl('', Validators.required),
      this.gender = new FormControl('', Validators.required),
      this.address = new FormControl('', [Validators.required, Validators.minLength(8)]),
      this.blood_group = new FormControl('', Validators.required)
  }

  createForm() {
    this.patientForm = new FormGroup({
      username: this.username,
      email: this.email,
      phoneNumber: this.phoneNumber,
      password: this.password,
      confirmPassword: this.confirmPassword,
      date_of_birth: this.date_of_birth,
      gender: this.gender,
      address: this.address,
      blood_group: this.blood_group
    }
    )
    console.log(this.patientForm)
  }


  submit() {
    const model: createAccount = {
      email: this.patientForm.value.email,
      password: this.patientForm.value.password,
      name: this.patientForm.value.username,
      date_of_birth: this.patientForm.value.date_of_birth,
      phone: this.patientForm.value.phoneNumber,
      gender: this.patientForm.value.gender,
      blood_group: this.patientForm.value.blood_group,
      address: this.patientForm.value.address
    }
    console.log(model);
    this._AuthService.createPatient(model).subscribe(res => {
      this.router.navigate(['/Login'])
    })
    this._AuthService.AuthlayoutLeft.next(false);
    this._AuthService.istrigger.next(true);

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

  // togglePassword(checkPass :number){
  //   if(checkPass===0){
  //     this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
  //     this.showPassword = true
  //     this.showConfirmPassword = false
  //   }else{
  //     this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
  //     this.showPassword = false
  //     this.showConfirmPassword = true
  //   }
  // }
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

}
