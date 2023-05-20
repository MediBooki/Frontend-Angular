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

// variable contains all terms and conditions
 termsConditionss = [
  {
      termsConditionsHead:'Create Agreement' , 
      termsConditionsContent:[
          `Thank you for visiting our website ‘MediBooki’.` , 
          `By accessing our services, you are thus entering into an agreement between you, whether you are an independent individual or you are on behalf of an organization or otherwise, and ’MediBooki‘ site administration and therefore you agree to follow the terms and conditions set out on this page, and you must verify that you have checked the checkbox beside Agree to The Terms and Conditions sentence to confirm that you agree to these terms.`
      ]
  } ,
  {
      termsConditionsHead:'Privacy Policy' , 
      termsConditionsContent:[
          `We use your personal information (name, address, phone number, email, etc.) to provide and improve the services you request.` , 
          `By using that service, you are consent to the collection and use of this information according to that Policy.` , 
          `This policy applies only to our site. Therefore, if you left our site through another link, you would comply with the policy and terms of the other site, as we have no control over the policy or terms of the other site to which you moved.`
      ]
  } ,
  {
      termsConditionsHead:'Patient Account & Registration' , 
      termsConditionsContent:[
          `You do not have to log in to visit our website, you can visit it without logging in, but to enjoy some services you will need to create a new account through the registration process in our website.` , 
          `When creating an account, you must provide the correct and complete registration information so that we can perform the services as required, and in case of changing any of this information, you must notify us immediately, and if you fail to provide or update this information, you will not be able to properly receive the requested information through the Website.` , 
          `You have to create a strong password and difficult to hack and keep it confidential at all times and not give it to anyone under any circumstances so you will not face any kind of problem because you will be responsible for any activities that take place on your user account by unauthorized parties. You must notify us if you strongly believe that your account has been hacked.` , 
          `By accessing and using our Services, you consent to our use of your email address, phone number, and other contact information to send notifications related to the Service, changes to features or special offers.` , 
          `The administration of ‘MediBooki’ site reserves the right to determine who may be eligible for an account and can refuse or cancel any account at any time without incurring any liability.`
      ]
  } ,
  {
      termsConditionsHead:'Use of information' , 
      termsConditionsContent:[
          `We may use the information we collect online for the following purposes:` , 
          `- Providing and improving services and fulfilling your requests` , 
          `- contact you` , 
          `- Sending information about clinical services or home care` , 
          `Note: No information provided by patients during medical consultations is ever used for marketing purposes as we do not share confidential information with third parties.`
      ]
  } ,
  {
      termsConditionsHead:'Protection and security' , 
      termsConditionsContent:[
          `On our site, we use many means to protect your personal information from loss, unauthorized access, modification, and destruction.` , 
          `We regularly scan our website for security holes and vulnerabilities in order to ensure that your visit to our site is as secure as possible.` , 
          `We ensure the protection of your account by converting the password to another text using hashing algorithms and by helping us also by setting a strong password, this will increase the level of security of your account but you must understand that the security of the stored information cannot be guaranteed by 100%, but we are trying to ensure the largest percentage of security for your information.` , 
          `Our website must be used in the correct and proper manner and must not be used in other illegal ways; do not try to interfere with its security features of the website, prevent others from accessing it, or cause any damage or destruction to the information on the website.` , 
          `In case of detecting any damage occurred on our site, we will refer the case to the relevant law enforcement authorities.` , 
      ]
  } ,
  {
      termsConditionsHead:'Medical Insurance' , 
      termsConditionsContent:[
          `In case you have medical insurance, then the medication you are dispensing will be discounted, but if it is proven that you are dispensing the medicine and then sell it for financial profit, your medical insurance will be suspended, and the necessary legal action will be taken.`
      ]
  } ,
  {
      termsConditionsHead:'Changes to the Terms and Conditions' , 
      termsConditionsContent:[
          `We may update the Terms and Conditions from time to time and will publish the new ones on this page.  Therefore, we advise you to review the terms and conditions periodically to always know the latest updates.` , 
          `These terms and conditions were last updated on [February 20, 2022].`
      ]
  }
];




  constructor(private fb: FormBuilder, private router: Router, private _AuthService: AuthService, private _DataService: DataService,private toastr:ToastrService) {

  }

  ngOnInit(): void {
    // this.localeService.use('ar');
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
    this.username = new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z]{1,}$/)]),
      this.email = new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]{2,}@[a-z]{2,}\.[a-zA-Z]{2,}$/)]),
      this.phoneNumber = new FormControl('', [Validators.required, Validators.pattern(/^\+?(002)?[\d\s()-]{4,}$/)]),
      this.password = new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)]),
      this.confirmPassword = new FormControl('', Validators.required),
      this.date_of_birth = new FormControl('', Validators.required),
      this.gender = new FormControl('', Validators.required),
      this.address = new FormControl('', [Validators.required, Validators.minLength(30)]),
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
    const model: createAccount = {
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
      this.router.navigate(['/Login'])
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
