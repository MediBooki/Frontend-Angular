import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Specialize } from 'src/app/core/interfaces/specialize';
import { DataService } from 'src/app/core/services/data.service';
import { SpecializationService } from 'src/app/core/services/specialization/specialization.service';
import { AuthService } from '../Auth/services/auth.service';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-specializations',
  templateUrl: './specializations.component.html',
  styleUrls: ['./specializations.component.scss']
})
export class SpecializationsComponent implements OnInit {

  // Direction Variables
  lang: string = "en";
  rtlDir: boolean = false;
  noData:boolean = true;
  noDataError: any; // in case of error

  specializations: Specialize[] = [];
  specializeSubscription = new Subscription();
  filterForm : FormGroup;


  isVisibleSpinner: boolean = true;


  // Pagination Configuration Variables
  numSepicaistPerPage: number = 9; // The number of specializations displayed per one page
  page: any = 1; // set current page
  totalRecords: number = 0; // number of all specializations in whole API

  defaultSpecializationImg:string = this._DataService.defaultNoImg;


  constructor(private _AuthService: AuthService, private _DataService: DataService, private _specializeService: SpecializationService, private _FormBuilder:FormBuilder, private router:Router) {
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
    this.getSpecializations();
    this.getLang()
  }

  // when view load completely
  ngAfterViewInit() {
    setTimeout(() => {
      Promise.resolve().then(() => this._DataService.isPageLoaded.next(true))
    }, 0);
  }

  getSpecializations() {
    this._DataService._lang.subscribe({
      next: (lang) => {
        this.lang = lang;
        if (lang == 'en') {
          this.rtlDir = false;
        } else {
          this.rtlDir = true;
        }
        this.isVisibleSpinner = true;
        this.specializeSubscription = this._specializeService.getSpecialization(lang, this.page).subscribe({
          next: (specialize) => {
            console.log(specialize)
            if(specialize.data.length == 0) {
              this.noData = true;
            } else {
              this.isVisibleSpinner = false;
              this.noData = false;
              this.totalRecords = specialize.count
              this.specializations = specialize.data;
              // this.numSepicaistPerPage = specialize.data.length // length of one page in API
              if(this.page===1){
                this.numSepicaistPerPage = specialize.data.length
              }
              console.log(this.specializations[0].name)
            }
          },
          error: (error) => {
            console.log(error)
            this.noDataError = error;
            this.isVisibleSpinner = false;
          }
        });
      }
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

  // triggered when click on specialization to show doctors in this specialization
  filterDoctors(specializationId:any, specializationName:any) {
    if(localStorage.getItem("filterForm") != null) {
      localStorage.setItem("filterForm",JSON.stringify(this.filterForm.value)); // put new values in localstorage
    }
    
      localStorage.setItem("filteredSpecializationContent",JSON.stringify([`${specializationName}`])); // put new values in localstorage
      this.filterForm.value["sections"].push(''+specializationId+''); // add new filter measure in filter form
      localStorage.setItem("filterForm",JSON.stringify(this.filterForm.value)); // put new values in localstorage
      this.router.navigate(["/doctors"])

  }

    // changing page in pagination
    changePage(pageNum: any) {
      this.page = pageNum;
      this.getSpecializations();
    }
}
