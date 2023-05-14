import { Component, HostListener, OnInit, ElementRef, ViewChild } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { DataService } from '../../core/services/data.service';
import { DoctorService } from '../doctors/service/doctor.service';
import { AuthService } from '../Auth/services/auth.service';
import * as $ from 'jquery';
import 'select2';
import { TranslateService } from '@ngx-translate/core';
import { Doctor } from 'src/app/core/interfaces/doctor';
import { Subscription } from 'rxjs';
import { Specialize } from 'src/app/core/interfaces/specialize';
// import { FormGroup } from '@angular/forms';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  /*=============================================( Variables )=============================================*/

  // Direction Variables
  lang: string = "en";
  rtlDir: boolean = false;
  direction: any = 'ltr';
  navText: string[] = ["<i class='carousel-left fa-solid fs-4 fa-arrow-left'></i>", "<i class='carousel-right fa-solid fs-4 fa-arrow-right'></i>"]; // arrows direction in owl carousel

  // API Variables
  allDoctors: Doctor[] = [];
  doctorsSubscription = new Subscription();
  allSpecializations: Specialize[] = [];
  latestSpecializations: Specialize[] = [];
  doctorsCountSubscribtion = new Subscription();
  distinguishedDoctors: Doctor[] = [];
  
  // Carousel Variables
  mainCarousel: OwlOptions = {} // Enabling Owl Carousel for Main Section
  specializationCarousel: OwlOptions = {} // Enabling Owl Carousel for Specialization Section
  doctorsCarousel: OwlOptions = {} // Enabling Owl Carousel for Doctors Section

  // Select2 Variables
  specializationSelect2Placeholder: any;
  doctorsSelect2Placeholder: any;

  // Counter Variables
  doctorsCounter: number = 0;
  usersCounter: number = 0;
  specializationCounter: number = 0;

  // each Counter stop point
  numOfDoctors: number = 0;
  numOfUsers: number = 0;
  numOfSpecializations: number = 0;


  // main section variable to know its height to use as start point to show scroll up button
  @ViewChild('mainSection') mainSection: ElementRef | undefined;

  // counters section variable to know its height to use as start point to begin counter
  @ViewChild('countersSection') countersSection: ElementRef | undefined;

  /*=============================================( Initialization Methods )=============================================*/

  constructor(private _DataService: DataService,private _DoctorService:DoctorService, private _AuthService: AuthService , private _TranslateService:TranslateService, private _FormBuilder:FormBuilder, private toastr: ToastrService, private router: Router) {
    // Declare FilterForm
    this.filterForm = this._FormBuilder.group({
      sections: new FormArray([])
    })

    // this.searchForm = this._FormBuilder.group({
    //   section: ['' , Validators.required],
    //   doctor: ['' , Validators.required]
    // })
  }

  ngOnInit(): void {
    Promise.resolve().then(() => this._DataService.isPageLoaded.next(false));
    Promise.resolve().then(() => this._AuthService.isLogedIn.next(true));
    // this.Authservice.isLogedIn.next(true);
    this.getLang();
    this.getFilteredDoctors();
    this.getSpecializations();
    this.getDistinguishedDoctors();
    this.getCounterVals();
  }

  // when view load completely
  ngAfterViewInit() {
    setTimeout(() => {
      Promise.resolve().then(() => this._DataService.isPageLoaded.next(true))
    }, 0);
  }


  /*=============================================( Component Created Methods )=============================================*/

  //----- Method 1
  // Setting Direction
  getLang() {
    this._DataService._lang.subscribe({
      next: (language) => {
        this.lang = language;

        if (language == 'en') {
          this.rtlDir = false;
          this.navText = ["<i class='carousel-left fa-solid fs-4 fa-arrow-left'></i>", "<i class='carousel-right fa-solid fs-4 fa-arrow-right'></i>"]; // arrows direction in owl carousel
          this.direction = 'ltr';
        } else {
          this.rtlDir = true;
          this.navText = ["<i class='carousel-left fa-solid fs-4 fa-arrow-right'></i>", "<i class='carousel-right fa-solid fs-4 fa-arrow-left'></i>"];
          this.direction = 'rtl';
        }

        this.changeCarousels();
        this.changeSelect2();
      }
    })
  }

  /*---------------------------------------------( Carousel )---------------------------------------------*/

  //----- Method 2
  // Change Carousels
  changeCarousels() {
    this.mainCarousel = {
      loop: true,
      margin: 10,
      rtl: this.rtlDir,
      nav: false,
      responsive: {
        0: {
          items: 1
        }
      },
      autoplay: true,
      autoplayTimeout: 3500,
      // autoplayHoverPause:true
    };

    this.specializationCarousel = {
      // margin: 30,
      rtl: this.rtlDir,
      loop: true,
      nav: true,
      autoplay: true,
      autoplayTimeout: 3500,
      // autoplayHoverPause:true,
      navText: this.navText,
      responsive: {
        0: {
          items: 1
        },
        600: {
          items: 2
        },
        900: {
          items: 3
        }
      }
    };

    this.doctorsCarousel = {
      margin: 15,
      rtl: this.rtlDir,
      loop: true,
      nav: false,
      autoplay: true,
      autoplayTimeout: 3500,
      // autoplayHoverPause:true,
      navText: this.navText,
      responsive: {
        0: {
          items: 1
        },
        600: {
          items: 2
        },
        900: {
          items: 3
        }
      }
    };

  }

  /*---------------------------------------------( Select2 )---------------------------------------------*/

  //----- Method 3
  // Change Select2
  changeSelect2() {
    console.log("whaaaaaaaaaaaaaaaaaat????????")
    this._TranslateService.get('HomePage.Select2Specialization').subscribe((data)=>{
      this.specializationSelect2Placeholder = data;
      $('.specialization-main-select2').select2({
        placeholder: this.specializationSelect2Placeholder,
        dir:this.direction
      });


      // triggered when we select specialization from specialization select2 to get doctors in this specialization
      $('.specialization-main-select2').change((event:any)=>{
        console.log(event.target.value)
        this.filterDoctorsBySpecialize(event.target.value);
      })
    }); // put palceholder for specialization select2
    
    this._TranslateService.get('HomePage.Select2Doctors').subscribe((data)=>{
      this.doctorsSelect2Placeholder = data;
      $('.doctors-main-select2').select2({
        placeholder: this.doctorsSelect2Placeholder,
        dir:this.direction
      });


      // triggered when we select doctor from doctors select2
      $('.doctors-main-select2').change((event:any)=>{
        console.log(event.target.value)
        this.selectedDoctor = event.target.value;
        // this.filterDoctorsBySpecialize(event.target.value);
      })
    }); // put palceholder for doctors select2


  }

  selectedDoctor:any = '';
  /*---------------------------------------------( Counter )---------------------------------------------*/

  // @HostListener('.specialization-main-select2:change') // method triggered every scroll
  // ggg() {
  //   console.log("hi")
  // }

  //----- Method 4
  @HostListener('window:scroll') // method triggered every scroll
  checkScroll() {

    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    //////////////////////////////// 1. scrollUp logic
    this._DataService.firstSectionHeight = this.mainSection?.nativeElement.offsetHeight;

    //////////////////////////////// 2. counter logic
    let counterSectionOffset = this.countersSection?.nativeElement.offsetTop; // section offset from website top
    let counterSectionHeight = this.countersSection?.nativeElement.offsetHeight; // section height

    // to check if we reached section level
    if (scrollPosition >= counterSectionOffset - counterSectionHeight * 0.5 && (this.doctorsCounter == 0 || this.usersCounter == 0 || this.specializationCounter == 0) && (this.numOfDoctors!=0 && this.numOfUsers!=0 && this.numOfSpecializations!=0)) {
      let doctorsCounter: number = 0;
      let usersCounter: number = 0;
      let specializationCounter: number = 0;
      let numOfAll = this.numOfDoctors + this.numOfUsers + this.numOfSpecializations;

      // loop on counter untill reach stop point
      let doctorsCounterStop: any = setInterval(() => {
        doctorsCounter++;
        this.doctorsCounter = doctorsCounter
        if (this.doctorsCounter >= this.numOfDoctors) {
          //clearinterval will stop counter
          clearInterval(doctorsCounterStop);
        }
      }, (numOfAll / this.numOfDoctors) * 10)

      let usersCounterStop: any = setInterval(() => {
        usersCounter++;
        this.usersCounter = usersCounter;
        if (this.usersCounter >= this.numOfUsers) {
          clearInterval(usersCounterStop);
        }
      }, (numOfAll / this.numOfUsers) * 10)

      let specializationCounterStop: any = setInterval(() => {
        specializationCounter++;
        this.specializationCounter = specializationCounter;
        if (this.specializationCounter == this.numOfSpecializations) {
          clearInterval(specializationCounterStop);
        }
      }, (numOfAll / this.numOfSpecializations) * 10)
    }

  }



//----- Method 4
  // get all specializations
  getSpecializations() {
    // to subscribe in language to know in case of changing
    this._DataService._lang.subscribe({
      next: (lang) => {
        this.lang = lang;
        if (lang == 'en') {
          this.rtlDir = false;
          this.direction = 'ltr';
        } else {
          this.rtlDir = true;
          this.direction = 'rtl';
        }

        this._DataService.getSections(this.lang).subscribe({
          next:(specializations)=>{
            this.allSpecializations = specializations.data;
            this.latestSpecializations = specializations.data.slice(0,5); // get latest specializations added
            console.log(this.allSpecializations)

          }
        })
      }
    })
  }


// searchForm : FormGroup;
filterForm : FormGroup;
// sectionArrayChecked:boolean[] = [];
filterDoctorsBySpecialize(specializationId:any) {
  this.filterForm.value["sections"].splice(0, this.filterForm.value["sections"].length);

  // if(specializationId == 'all') {
  //   this.getFilteredDoctors();
  // } else {
    this.filterForm.value["sections"].push(specializationId)
    console.log(this.filterForm.value["sections"])
    this.getFilteredDoctors();
  // }
}

getFilteredDoctors() {

  this._DataService._lang.subscribe({
    next: (lang) => {this.lang = lang;
      if (lang == 'en') {
        this.rtlDir = false;
        this.direction = 'ltr';} else {
          this.rtlDir = true;
          this.direction = 'rtl'; }


  this._DoctorService.getFilteredDoctors(this.filterForm.value,this.lang, 1).subscribe({
    next: (doctors) => {
      
        console.log(doctors.data)
        this.allDoctors = doctors.data;
    }})
  }})
  // console.log(this.allDoctors)
}



bookDoctor(eve:any) {
  if(eve.value == "") {
    this.toastr.warning(!this.rtlDir?`Choose Doctor First Before Booking`:`اختر طبيب أولا لحجزه`)
    return
  }
  this.router.navigate(['/appointments',eve.value])
  console.log(eve.value)
}


// @HostListener('window:resize', ['$event'])
// onResize(event:any) {
//   console.log(event.target.innerWidth)
// }


  getDistinguishedDoctors() {

    this._DataService._lang.subscribe({
      next: (lang) => {this.lang = lang;
        if (lang == 'en') {
          this.rtlDir = false;
          this.direction = 'ltr';} else {
            this.rtlDir = true;
            this.direction = 'rtl'; }


        this._DataService.getDistinguishedDoctors(lang).subscribe({
          next:(doctors)=>{
            this.distinguishedDoctors = doctors.data;
            console.log(doctors)
          }
        })
      }
    })
  }

  getCounterVals() {
    this._DataService.getCounterVals().subscribe({
      next:(res)=>{
        this.numOfDoctors = res.doctors;
        this.numOfUsers = res.patients;
        this.numOfSpecializations = res.sections;
      }
    })
  }

  ngOnDestroy() {
    $('.specialization-main-select2').select2();
    $('.doctors-main-select2').select2();
  }

}
