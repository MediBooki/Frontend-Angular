import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/pages/Auth/services/auth.service';
import { DataService } from 'src/app/core/services/data.service';
import { ContactUsService } from '../../service/contact-us.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Roadmap } from 'src/app/core/interfaces/roadmap';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit, OnDestroy {


  // roadmap variable
  roadMapLinks:Roadmap = {
    roadMabFirstLink: {arabic:'الرئيسية',english:'Home',link:'/home'},
    roadMabLastLink: {arabic:'تواصل معنا',english:'Contact Us'},
    roadMabIntermediateLinks: [

    ]
  }

  constructor(private _AuthService: AuthService,private _DataService: DataService,private _contactus:ContactUsService,private toastr: ToastrService) { }

  ngOnInit(): void {
    this._DataService.firstSectionHeight = this.firstSection?.nativeElement.offsetHeight;

    this.getLang();
    this.getcontacts()
  }

  // when view load completely
  // ngAfterViewInit() {
  //   setTimeout(() => {
  //     Promise.resolve().then(()=>this._DataService.isPageLoaded.next(true))
  //   },0);
  // }

  /*=============================================( Variables )=============================================*/
  lang:string = "en";
  rtlDir:boolean = false;
  direction:string = 'ltr';

  //contact us form
  contactUsForm = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9]{1,}.*[a-zA-Z0-9]{1,}@[a-z]{2,}\.[a-zA-Z]{2,}$/)]),
    name : new FormControl("", [Validators.required]),
    phone : new FormControl("", [Validators.required, Validators.pattern(/^\+?(002)?[\d\s()-]{4,}$/)]),
    description : new FormControl("", [Validators.required])
  })

  // API Subscriptions Variables
  contactUsSubscription = new Subscription();
  contactsSubscription = new Subscription();
  contacts: any;

  /*=============================================( Component Created Methods )=============================================*/

  //----- Method 1
  @ViewChild('firstSection') firstSection: ElementRef | undefined;
  @HostListener('window:scroll') // method triggered every scroll
  checkScroll() {
    this._DataService.firstSectionHeight = this.firstSection?.nativeElement.offsetHeight;
  }

  //----- Method 2
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

  //----- Method 3
  // Setting Direction
  contactUs(){
     
    if(this.contactUsForm.valid){
      this.contactUsSubscription = this._contactus.contactUs(this.contactUsForm.value).subscribe({
        next: (response) => {
           
          this.toastr.success(!this.rtlDir?`Your inquiry has been sent successfully!`:`تم ارسال استفسارك بنجاح`);
          // this.router.navigate(['/home']);
        },
        error : (error)=> {
           
          this.toastr.error(!this.rtlDir?`Something went wrong try again`:`هناك خطأ ما حاول مجدداً` );
        }
      })
    }else{
      this.toastr.error(!this.rtlDir?`Please enter all data`:`من فضلك ادخل جميع البيانات` );
    }

  }

  getcontacts() {
        this.contactsSubscription = this._contactus.getContact().subscribe({
          next:(res)=>{
            this.contacts = res.data[0];
          }
        })
  }

  /*=============================================( Destroying Method )=============================================*/

  ngOnDestroy() {
    this.contactUsSubscription.unsubscribe();
    this.contactsSubscription.unsubscribe();
  }
}
