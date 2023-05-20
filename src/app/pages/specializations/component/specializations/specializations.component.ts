import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Specialize } from 'src/app/core/interfaces/specialize';
import { DataService } from 'src/app/core/services/data.service';
import { SpecializationService } from '../../service/specializations.service';
import { AuthService } from 'src/app/pages/Auth/services/auth.service';
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



  isVisibleSpinner: boolean = true;


  // Pagination Configuration Variables
  numSepicaistPerPage: number = 9; // The number of specializations displayed per one page
  page: any = 1; // set current page
  totalRecords: number = 0; // number of all specializations in whole API

  defaultSpecializationImg:string = this._DataService.defaultNoImg;


  constructor(private _AuthService: AuthService, private _DataService: DataService, private _specializeService: SpecializationService, private router:Router) {

  }

  ngOnInit(): void {
    // Promise.resolve().then(() => this._DataService.isPageLoaded.next(false));
    // Promise.resolve().then(() => this._AuthService.isLogedIn.next(true));
    this.getSpecializations();
    this.getLang()
  }

  // when view load completely
  // ngAfterViewInit() {
  //   setTimeout(() => {
  //     Promise.resolve().then(() => this._DataService.isPageLoaded.next(true))
  //   }, 0);
  // }

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


    // changing page in pagination
    changePage(pageNum: any) {
      this.page = pageNum;
      this.getSpecializations();
    }
}
