import { Component, HostListener, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
// import { OwlOptions } from 'ngx-owl-carousel-o';
import { DataService } from 'src/app/core/services/data.service';
import { DoctorService } from 'src/app/pages/doctors/service/doctor.service';
import { AuthService } from 'src/app/pages/Auth/services/auth.service';
import { HomeService } from '../../service/home.service';
import { SpecializationService } from 'src/app/pages/specializations/service/specializations.service';
import * as $ from 'jquery';
import 'select2';
import { TranslateService } from '@ngx-translate/core';
import { Doctor } from 'src/app/core/interfaces/doctor';
import { Subscription } from 'rxjs';
import { Specialize } from 'src/app/core/interfaces/specialize';
import { MainCarousel } from 'src/app/core/interfaces/main-carousel';
// import { FormGroup } from '@angular/forms';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ArticlesService } from 'src/app/pages/articles/service/articles.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit, OnDestroy  {
 
  /*=============================================( Variables )=============================================*/

  // Direction Variables
  lang: string = "en";
  rtlDir: boolean = false;
  direction: any = 'ltr';
  navText: string[] = ["<i class='carousel-left fa-solid fs-4 fa-arrow-left'></i>", "<i class='carousel-right fa-solid fs-4 fa-arrow-right'></i>"]; // arrows direction in owl carousel

  // API Variables
  allDoctors: Doctor[] = [];
  allSpecializations: Specialize[] = [];
  latestSpecializations: Specialize[] = [];
  distinguishedDoctors: Doctor[] = [];
  sliderImages:MainCarousel[] = []
  articles: any[] = [];
  
  // API Subscriptions Variables
  doctorsSubscription = new Subscription();
  articlesSubscription = new Subscription();
  sliderImgsSubscription = new Subscription();
  countersSubscription = new Subscription();
  distinguishedDoctorsSubscription = new Subscription();
  specializationsSubscription = new Subscription();

  // Carousel Variables
  mainCarousel: any // Enabling Owl Carousel for Main Section
  specializationCarousel: any // Enabling Owl Carousel for Specialization Section
  doctorsCarousel: any // Enabling Owl Carousel for Doctors Section

  // Select2 Variables
  specializationSelect2Placeholder: any;
  doctorsSelect2Placeholder: any;

  // Counter Variables
  doctorsCounter: number = 0;
  usersCounter: number = 0;
  specializationCounter: number = 0;
  page:number=1

  // each Counter stop point
  numOfDoctors: number = 0;
  numOfUsers: number = 0;
  numOfSpecializations: number = 0;

  // other Variables
  // isVisibleSpinner:boolean = false;
  search:string=''


  // main section variable to know its height to use as start point to show scroll up button
  @ViewChild('mainSection') firstSection: ElementRef | undefined;

  // counters section variable to know its height to use as start point to begin counter
  @ViewChild('countersSection') countersSection: ElementRef | undefined;

  /*=============================================( Initialization Methods )=============================================*/
  screenWidth:number[];
  constructor(private _DataService: DataService,private _SpecializationService:SpecializationService, private _DoctorService:DoctorService,private _HomeService:HomeService, private _ArticlesService:ArticlesService, private _AuthService: AuthService , private _TranslateService:TranslateService, private _FormBuilder:FormBuilder, private toastr: ToastrService, private router: Router) {
    // Declare FilterForm
    this.filterForm = this._FormBuilder.group({
      sections: new FormArray([])
    })

    if(window.innerWidth>=1000) {
      this.screenWidth = [0,0,0]
    } else if (window.innerWidth<768) {
      this.screenWidth = [0]
    } else {
      this.screenWidth = [0,0]
    }
    // this.searchForm = this._FormBuilder.group({
    //   section: ['' , Validators.required],
    //   doctor: ['' , Validators.required]
    // })
  }

  ngOnInit(): void {
    this._DataService.firstSectionHeight = this.firstSection?.nativeElement.offsetHeight;
    this.getLang();
    this.getFilteredDoctors();
    this.getSpecializations();
    this.getDistinguishedDoctors();
    this.getCounterVals();
    this.getSliderImages();
    this.getArticles();
  }

  // when view load completely
  // ngAfterViewInit() {
  //   setTimeout(() => {
  //     Promise.resolve().then(() => this._DataService.isPageLoaded.next(true))
  //   }, 0);
  // }


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
      autoplayHoverPause:true
    };

    this.specializationCarousel = {
      // margin: 30,
      rtl: this.rtlDir,
      loop: true,
      nav: true,
      autoplay: true,
      autoplayTimeout: 3500,
      autoplayHoverPause:true,
      navText: this.navText,
      responsive: {
        0: {
          items: 1,
          nav:false,
          dots:true
        },
        768: {
          items: 2,
          nav:true,
          dots:false
        },
        1000: {
          items: 3,
          nav:true,
          dots:false
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
      autoplayHoverPause:true,
      navText: this.navText,
      responsive: {
        0: {
          items: 1
        },
        768: {
          items: 2
        },
        1000: {
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

  //----- Method 4
  @HostListener('window:scroll') // method triggered every scroll
  checkScroll() {

    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    //////////////////////////////// 1. scrollUp logic
    this._DataService.firstSectionHeight = this.firstSection?.nativeElement.offsetHeight;

    //////////////////////////////// 2. counter logic
    let counterSectionOffset = this.countersSection?.nativeElement.offsetTop; // section offset from website top
    let counterSectionHeight = this.countersSection?.nativeElement.offsetHeight; // section height

    // to check if we reached section level
    if (scrollPosition >= counterSectionOffset - counterSectionHeight * 0.5 && (this.doctorsCounter == 0 || this.usersCounter == 0 || this.specializationCounter == 0)) {
      let doctorsCounter: number = 0;
      let usersCounter: number = 0;
      let specializationCounter: number = 0;
      let numOfAll = this.numOfDoctors + this.numOfUsers + this.numOfSpecializations;

      if(this.numOfDoctors!=0) {
        // loop on counter untill reach stop point
        let doctorsCounterStop: any = setInterval(() => {
          doctorsCounter++;
          this.doctorsCounter = doctorsCounter
          if (this.doctorsCounter >= this.numOfDoctors) {
            //clearinterval will stop counter
            clearInterval(doctorsCounterStop);
          }
        }, (numOfAll / this.numOfDoctors) * 10)
      }

      if(this.numOfUsers!=0) {
        let usersCounterStop: any = setInterval(() => {
          usersCounter++;
          this.usersCounter = usersCounter;
          if (this.usersCounter >= this.numOfUsers) {
            clearInterval(usersCounterStop);
          }
        }, (numOfAll / this.numOfUsers) * 10)
      }

      if(this.numOfSpecializations!=0) {
        let specializationCounterStop: any = setInterval(() => {
          specializationCounter++;
          this.specializationCounter = specializationCounter;
          if (this.specializationCounter == this.numOfSpecializations) {
            clearInterval(specializationCounterStop);
          }
        }, (numOfAll / this.numOfSpecializations) * 10)
      }
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

        this.specializationsSubscription = this._SpecializationService.getSpecialization(this.lang , this.page , this.search).subscribe({
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


          this.doctorsSubscription = this._DoctorService.getFilteredDoctors(this.filterForm.value,this.lang, 1).subscribe({
            next: (doctors) => {
              console.log(doctors.data)
              this.allDoctors = doctors.data;
            }
          })
    }
  })
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
          this.direction = 'ltr';
        } else {
            this.rtlDir = true;
            this.direction = 'rtl'; 
        }


        this.distinguishedDoctorsSubscription = this._HomeService.getDistinguishedDoctors(lang).subscribe({
          next:(doctors)=>{
            this.distinguishedDoctors = doctors.data;
            console.log(doctors)
          }
        })
      }
    })
  }

  getCounterVals() {
    this.countersSubscription = this._HomeService.getCounterVals().subscribe({
      next:(res)=>{
        this.numOfDoctors = res.doctors;
        this.numOfUsers = res.patients;
        this.numOfSpecializations = res.sections;
        console.log(this.numOfDoctors)
      }
    })
  }

  getSliderImages() {
    this._DataService._lang.subscribe({
      next: (lang) => {
        this.lang = lang;
        // this.isVisibleSpinner = true
        if (lang == 'en') {
          this.rtlDir = false;
          this.direction = 'ltr';
        } else {
          this.rtlDir = true;
          this.direction = 'rtl'; 
        }
        this.sliderImgsSubscription = this._HomeService.getSliderImages(this.lang).subscribe({
          next:(res)=>{
            console.log(res)
            this.sliderImages = res.data;
            // this.isVisibleSpinner = false;
          } , 
          error:()=>{
            // this.isVisibleSpinner = false;
          }
        })
      }
    }) 
  }

  getArticles() {
    this._DataService._lang.subscribe({
      next:(language)=>{
        // to get all sections
        this.articlesSubscription = this._ArticlesService.getArticales(language).subscribe({
          next: (articales) => {
            this.articles = articales.data.slice(0,3);
            console.log(articales);
          },
          error: (error) => {
            console.log(error)
            // this.articalsRes = error;
          }
      });
    }});
  }

  
  /*=============================================( Destroying Method )=============================================*/

  ngOnDestroy() {
    this.articlesSubscription.unsubscribe();
    this.sliderImgsSubscription.unsubscribe();
    this.countersSubscription.unsubscribe();
    this.distinguishedDoctorsSubscription.unsubscribe();
    this.specializationsSubscription.unsubscribe();
    this.doctorsSubscription.unsubscribe();

    $('.specialization-main-select2').select2();
    $('.doctors-main-select2').select2();
  }

}
