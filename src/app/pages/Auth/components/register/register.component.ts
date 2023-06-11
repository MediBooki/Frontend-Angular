import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationStart, Router } from '@angular/router';
import { createAccount } from 'src/app/core/interfaces/patients';
import { AuthService } from '../../services/auth.service';
import { DatePipe } from '@angular/common';
import { DataService } from 'src/app/core/services/data.service';
import { ToastrService } from 'ngx-toastr';
// import { BsLocaleService } from 'ngx-bootstrap/datepicker';
// import { defineLocale } from 'ngx-bootstrap/chronos';
// import { arLocale } from 'ngx-bootstrap/locale';
import { TermCondition } from 'src/app/core/interfaces/term-condition';






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
  terms_conditions!:FormControl
  lang: string = "en";
  rtlDir: boolean = false;
  direction: any = 'ltr';

  passwordType: string = 'password';
  showPassword:boolean=false
  showConfirmPassword:boolean=false

  isVisibleSpinner: boolean = false;

termsConditions:TermCondition[]=[]
  isSmallScreen = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isSmallScreen = window.innerWidth < 576; // Adjust the breakpoint as needed
  }

  /*============================================( Terms & Conditions )============================================*/



  constructor(private fb: FormBuilder, private router: Router, private _AuthService: AuthService, private _DataService: DataService,private toastr:ToastrService) {

  }

  ngOnInit(): void {
    this._DataService.firstSectionHeight = 0;
    this.initFormControl()
    this.createForm();
    Promise.resolve().then(() => this._DataService.isPageLoaded.next(false));
    Promise.resolve().then(() => this._AuthService.isLogedIn.next(false));
    Promise.resolve().then(() => this._AuthService.AuthlayoutLeft.next(false));
    this.getLang();
    this.getTerms();
  }

  // when view load completely
  ngAfterViewInit() {
    setTimeout(() => {
      Promise.resolve().then(() => this._DataService.isPageLoaded.next(true))
    }, 0);
  }


  initFormControl() {
    this.username = new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z\s]{1,}$/)]),
      this.email = new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]{2,}@[a-z]{2,}\.[a-zA-Z]{2,}$/)]),
      this.phoneNumber = new FormControl('', [Validators.required, Validators.pattern(/^\+?(002)?[\d\s()-]{4,}$/)]),
      this.password = new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)]),
      this.confirmPassword = new FormControl('', Validators.required),
      this.date_of_birth = new FormControl('', Validators.required),
      this.gender = new FormControl('', Validators.required),
      this.address = new FormControl('', [Validators.required, Validators.minLength(5)]),
      this.blood_group = new FormControl('', Validators.required),
      this.terms_conditions =new FormControl('', Validators.required)
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
      blood_group: this.blood_group,
      terms_conditions:this.terms_conditions
    }
    )
    console.log(this.patientForm)
  }


  submit() {
    const model: any = {
      email: this.patientForm.value.email,
      password: this.patientForm.value.password,
      name: this.patientForm.value.username,
      date_of_birth: this.patientForm.value.date_of_birth,
      phone: this.patientForm.value.phoneNumber,
      gender: this.patientForm.value.gender,
      blood_group: this.patientForm.value.blood_group,
      address: this.patientForm.value.address,
    }
    console.log(model);
    this.isVisibleSpinner = true;
    this._AuthService.createPatient(model).subscribe(res => {
      this.toastr.success(!this.rtlDir?`patient Added Successfully`:`تمت اضافة المريض بنجاح`)
      this.router.navigate(['/auth/Login'])
      this.isVisibleSpinner = false;
    },(error)=>{
      console.log(error);
      Object.entries(error.error.errors).forEach(([key , value] : any) => {
        console.log(key,value)
        this.toastr.error(value[0])
      })
      this.isVisibleSpinner = false;

      // .forEach(([key , value] : any)

    })
    this._AuthService.AuthlayoutLeft?.next(false);
    this._AuthService.istrigger?.next(true);

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

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  getTerms() {
    this._DataService._lang.subscribe({
      next: (language) => {
        this.lang = language;
        if (language == 'en') {
          this.rtlDir = false;
        } else {
          this.rtlDir = true;

        }
        this._AuthService.getTerms(this.lang).subscribe({
          next:(terms)=>{
            console.log(terms)
            this.termsConditions = terms.data;
          }
        })

      }
    })
    
  }





}
