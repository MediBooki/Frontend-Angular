import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';
import { DoctorService } from '../../service/doctor.service';
import { Doctor } from 'src/app/core/interfaces/doctor';
import { AuthService } from 'src/app/pages/Auth/services/auth.service';
import { SpecializationService } from 'src/app/pages/specializations/service/specializations.service';
import { Subscription } from 'rxjs';
// import * as $ from 'jquery';
// import 'select2';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Specialize } from 'src/app/core/interfaces/specialize';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';


@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.component.html',
  styleUrls: ['./doctors.component.scss']
})

export class DoctorsComponent implements OnInit {

  /*=============================================( Variables )=============================================*/

  // Direction Variables
  rtlDir: boolean = false;
  lang: string = "en";
  direction: any = "ltr";

  // API Variables
  allDoctors: Doctor[] = [];
  doctorsSubscription = new Subscription();
  allSpecializations: Specialize[] = [];
  hospitalPhone:string = "";

  // Pagination Configuration Variables
  numDoctorsPerPage: number = 10; // number of doctors displayed per one page
  page: any = 1; // set current page
  totalRecords: number = 0; // number of all doctors in whole API

  // Filter and Search Form Variables
  filterForm : FormGroup;
  titlesArray:{id:number, name:string, name_ar:string}[] = [
    {id:0 , name:'Professor' , name_ar:"استاذ"},
    {id:1 , name:'Consultant' , name_ar:"استشارى"},
    {id:2 , name:'Specialist' , name_ar:"متخصص"}
  ];
  gendersArray:{id:number, name:string, name_ar:string}[] = [
    {id:0 , name:"Male" , name_ar:"رجل"},
    {id:1 , name:"Female" , name_ar:"امرأة"},
  ];
  titleArrayChecked:boolean[] = [];
  genderArrayChecked:boolean[] = [];
  sectionArrayChecked:boolean[] = [];
  filteredContent:string[] = []; // names of specializations filtered by
  filterArrays:string[] = ["titles" , "genders" , "sections"]; // names of arrays in filter form

  // Other Variables
  noDataError: any = ""; // in case of error
  smallFilterVisible: boolean = false; // to show small filter
  isVisibleSpinner:boolean = true;
  noData:boolean = false;
  numOfDoctors: number = 0;
  numOfSpecializations: number = 0;

  // first section in component to know it's height
  @ViewChild('firstSection') firstSection: ElementRef | undefined;



  /*=============================================( Initialization Methods )=============================================*/

  constructor(private _DataService: DataService, private _SpecializationService:SpecializationService, private _DoctorService: DoctorService, private _AuthService: AuthService, private _FormBuilder:FormBuilder, private toastr: ToastrService, private router: Router) {
    // Declare FilterForm
    this.filterForm = this._FormBuilder.group({
      titles: new FormArray([]),
      genders: new FormArray([]),
      sections: new FormArray([]),
      name:"",
      specialization:""
    })
  }
  
  ngOnInit(): void {
    Promise.resolve().then(() => this._DataService.isPageLoaded.next(false));
    Promise.resolve().then(() => this._AuthService.isLogedIn.next(true));

    this.gethospitalDetails(); // to get book phone
    this.getFilteredForm(); // to set filter form and use localstorage
    this.getFilteredDoctors(); // get filtered doctors from API
    this.getSpecializations(); // get specializations from API
    this.getCounterVals();
    this.isVisibleSpinner = true;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      Promise.resolve().then(() => this._DataService.isPageLoaded.next(true))
    }, 0);
  }


  /*=============================================( Component Created Methods )=============================================*/

  //----- Method 1
  @HostListener('window:scroll') // method triggered every scroll
  checkScroll() {
    this._DataService.firstSectionHeight = this.firstSection?.nativeElement.offsetHeight;
  }


  /*---------------------------------------------( API )---------------------------------------------*/

  //----- Method 2
  gethospitalDetails() {
    this._DoctorService.gethospitalDetails().subscribe({
      next:(details)=>{
        console.log(details.data[0])
        this.hospitalPhone = details.data[0].phone;
      }
    })
  }

  //----- Method 3
  // to get doctors by subscribing on API
  getFilteredDoctors() {

    // to subscribe in language to know in case of changing
    this._DataService._lang.subscribe({
      next: (lang) => {
        // const box = document.getElementsByClassName('.overlay-container');
        // console.log(box)
        this.lang = lang;
        if (lang == 'en') {
          this.rtlDir = false;
          this.direction = 'ltr';
          // box[0]?.classList.remove('overlay-container-arabic');
          // overlay-container-arabic
        } else {
          this.rtlDir = true;
          this.direction = 'rtl';
          // box[0]?.classList.add('overlay-container-arabic');
          // overlay-container-arabic
        }

        this.isVisibleSpinner = true; //trigger spinner
        this.doctorsSubscription = this._DoctorService.getFilteredDoctors(this.filterForm.value,this.lang, this.page).subscribe({
          next: (doctors) => {
            console.log(this.doctorsSubscription)
            this.noData = doctors.data.length == 0 ? true : false // no data will be true in case that filteredDoctors is empty
            this.totalRecords = doctors.count
            this.allDoctors = doctors.data;
            console.log(this.allDoctors)
            if (this.page == 1) {
              this.numDoctorsPerPage = doctors.data.length // length of one page in API
            }
            // this.numDoctorsPerPage = doctors.data.length // length of one page in API
            this.isVisibleSpinner = false;
            console.log(this.filterForm.value)
          },
          error: (error) => {
            localStorage.setItem("filterForm",JSON.stringify(this.filterForm.value)); // put new values in localstorage
            this.noDataError = error;
            this.isVisibleSpinner = false;
            this.toastr.error(this.rtlDir?`An Error has occured`:`حدث خطأ ما` , `${error}`)
          }

        });
      }
    })
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

        this._SpecializationService.getSpecialization(this.lang,this.page).subscribe({
          next:(specializations)=>{
            this.allSpecializations = specializations.data;
            console.log(this.allSpecializations)
            this.getSpecificSpecialization(); // to change name when change dir
          }
        })
      }
    })
  }


  /*---------------------------------------------( Init FilterForm )---------------------------------------------*/

  //----- Method 5
  // set local storage and filter form
  getFilteredForm() {
    if (localStorage.getItem('filterForm') != null) {

      // to set string filter items from local storage
      this.filterForm.patchValue({
        name:JSON.parse(localStorage.getItem("filterForm")!).name,
        specialization:JSON.parse(localStorage.getItem("filterForm")!).specialization
      })

      // to set array filter items from local storage
      this.filterArrays.forEach((filterName)=>{
        JSON.parse(localStorage.getItem("filterForm")!)[filterName].forEach((filterNum:any) => {
          this.filterForm.value[filterName].push(filterNum);
          switch (filterName) {
            case "titles":
              this.titleArrayChecked[Number(filterNum)] = true; // to 
              break;
          
            case "genders":
            this.genderArrayChecked[Number(filterNum)] = true; // to 
            break;

            case "sections":
            this.sectionArrayChecked[Number(filterNum)] = true; // to 
            break;

            default:
              break;
          }
        });
      })
      
    } else { // in case that no local storage
      localStorage.setItem("filterForm",JSON.stringify(this.filterForm.value)); // initialize empty filter form in localstorage
    }

    if (localStorage.getItem('filteredSpecializationContent') != null) { //if filtered specialization names array is not set in localstorage
      this.filteredContent = JSON.parse(localStorage.getItem("filteredSpecializationContent")!)
    }
  }


  /*---------------------------------------------( Pagination )---------------------------------------------*/

  //----- Method 6
  // changing page in pagination
  changePage(pageNum: any) {
    this.page = pageNum;
    this.setFilterForm();
    this.getFilteredDoctors();
  }


  /*---------------------------------------------( Small Filter )---------------------------------------------*/

  //----- Method 7
  showSmallFilter() {
    this.smallFilterVisible = true;
    $('body').removeClass('overflow-auto');
    $('body').addClass('overflow-hidden');
  }

  //----- Method 8
  hideSmallFilter() {
    this.smallFilterVisible = false;
    $('body').addClass('overflow-auto');
    $('body').removeClass('overflow-hidden');
  }


  /*---------------------------------------------( Filter Form Logic )---------------------------------------------*/

  //----- Method 9
  // triggered when check or uncheck any input checkbox filter 
  getStats(event:any,formControlName:string) {
    console.log(JSON.parse(localStorage.getItem("filterForm")!)[formControlName])

    // to check or uncheck the correct checkbox input
    switch (formControlName) {
      case "sections":
        this.sectionArrayChecked[event.target.value] = event.target.checked
        break;

      case "titles":
        this.titleArrayChecked[event.target.value] = event.target.checked
      break;

      case "genders":
        this.genderArrayChecked[event.target.value] = event.target.checked
      break;

      default:
        break;
    }

    // JSON.parse(localStorage.getItem("filterForm")!)[formControlName].includes(event.target.value)
    if(!event.target.checked) { // in case that checkbox checked before and clicked then remove check
      this.setFilterForm(); // set filter form with local storage value
      let removeIndex = this.filterForm.value[formControlName].indexOf(event.target.value); // to know index of unchecked input
      console.log(removeIndex)
      if (removeIndex !== -1) {
        this.filterForm.value[formControlName].splice(removeIndex, 1); // to delete unchecked input
      }
      this.toastr.success(!this.rtlDir?`Filter by ${formControlName} has been unset!`:`تم ازالة تصنيف الأطباء` , !this.rtlDir?`Filter Result`:`ناتج التصنيف`)
    } else {
        this.page = 1;
        this.setFilterForm(); // set filter form with local storage value
        this.filterForm.value[formControlName].push(event.target.value); // add new filter measure in filter form
        this.toastr.success(!this.rtlDir?`Filter by ${formControlName} has been set successfully!`:`تم تصنيف الأطباء بنجاح` , !this.rtlDir?`Filter Result`:`ناتج التصنيف`)
    }

    this.getFilteredDoctors(); // filter doctors based on filter form
    localStorage.setItem("filterForm",JSON.stringify(this.filterForm.value)); // put latest changes in localstorage
    
  }

  //----- Method 10
  GetTitleStats(event: any) {
    this.getStats(event,'titles')
  }

  //----- Method 11
  GetGenderStats(event: any) {
    this.getStats(event,'genders')
  }

  //----- Method 12
  GetSpecializationStats(event: any) {
    this.getStats(event,'sections')
    this.getSpecificSpecialization(); // get names of specializations filtered by
    
  }

  //----- Method 13
  // to know names of specializations filtered by
  getSpecificSpecialization() {
    let checkedSpecializationsArr:string[] = [] // array to put all checked specializations in
    JSON.parse(localStorage.getItem("filterForm")!).sections.forEach((element:any) => { // loop on all specializations to get names of checked ones
      let getSpecificSpecialization = this.allSpecializations.find((doctor:any)=>doctor.id == element); // compare each value in sections array with all specializations array to get name
      if(getSpecificSpecialization != null) {
        checkedSpecializationsArr.push(getSpecificSpecialization.name)
      }
    });
    
    this.filteredContent = checkedSpecializationsArr;
    localStorage.setItem("filteredSpecializationContent",JSON.stringify(this.filteredContent))
  }

  //----- Method 14
  // to set filter form with local storage value after each transaction
  setFilterForm() {
    this.filterArrays.forEach((filterName)=>{ // loop on arrays names exist in filter form
      this.filterForm.value[filterName].splice(0, this.filterForm.value[filterName].length); // truncate filter form
      JSON.parse(localStorage.getItem("filterForm")!)[filterName].forEach((filterNum:any) => { // loop on each localstorage array item to put in filter form
        this.filterForm.value[filterName].push(filterNum);
      });
    })
  }

  //----- Method 15
  // get doctors and trigger toastr for search form
  triggerToastrSearch() {
    localStorage.setItem("filterForm",JSON.stringify(this.filterForm.value)); // put new values in localstorage
    this.getFilteredDoctors(); // filter doctors based on filter form

    // trigger toastr
    if(this.filterForm.value['name']=="" && this.filterForm.value['specialization']=="") {
      this.toastr.success(!this.rtlDir?`Searching All Doctors`:`البحث عن كل الأطباء`)
    } else {
      if(this.filterForm.value['name']!="" && this.filterForm.value['specialization']!="") {
        this.toastr.success(!this.rtlDir?`Searching Doctors by Name: ${this.filterForm.value['name']} and Specialization: ${this.filterForm.value['specialization']}`:`البحث عن الأطباء باسم: ${this.filterForm.value['name']} وتخصص: ${this.filterForm.value['specialization']}`)
      } else {
        if(this.filterForm.value['name']=="") {
          this.toastr.success(!this.rtlDir?`Searching Doctors by Specialization: ${this.filterForm.value['specialization']}`:`البحث عن الأطباء بتخصص: ${this.filterForm.value['specialization']}`)
        } else {
          this.toastr.success(!this.rtlDir?`Searching Doctors by Name: ${this.filterForm.value['name']}`:`البحث عن الأطباء باسم: ${this.filterForm.value['name']}`)
        }
      }
    }
  }


  /*---------------------------------------------( Search Form Logic )---------------------------------------------*/

  //----- Method 16
  // when clicking on search button 
  submitSearchForm() {
    this.page = 1;
    this.setFilterForm(); // set filter form with local storage value
    this.triggerToastrSearch(); // to get all doctors and trigger toastr
  }

  //----- Method 17
  // when click on repeat icon on search input
  resetSearch(inputEventInfo:any) {
    this.page = 1;
    this.setFilterForm(); // set filter form with local storage value
    this.filterForm.controls[inputEventInfo.attributes.formcontrolname.nodeValue].setValue("") // to reset input search
    this.triggerToastrSearch(); // to get all doctors and trigger toastr
  }


  getCounterVals() {
    this._DataService.getCounterVals().subscribe({
      next:(res)=>{
        this.numOfDoctors = res.doctors;
        this.numOfSpecializations = res.sections-1;
      }
    })
  }

  /*=============================================( Destroying Method )=============================================*/

  ngOnDestroy() {
    this.doctorsSubscription.unsubscribe();
    const currentUrl = this.router.url;

    if(!currentUrl.includes("doctors")) {
      this.filteredContent = [];
      localStorage.setItem("filteredSpecializationContent",JSON.stringify(this.filteredContent));
      this.filterForm.patchValue({
        titles:[],
        genders:[],
        sections:[],
        name:'',
        specialization:''
      })
      localStorage.setItem("filterForm",JSON.stringify(this.filterForm.value)); // initialize empty filter form in localstorage
    }
  }
}
