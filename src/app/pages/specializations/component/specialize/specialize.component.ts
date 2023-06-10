import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Specialize } from 'src/app/core/interfaces/specialize';
import { DataService } from 'src/app/core/services/data.service';
// import { SpecializationService } from 'src/app/core/services/specialization/specialization.service';
import { SpecializationService } from '../../service/specializations.service';

@Component({
  selector: 'app-specialize',
  templateUrl: './specialize.component.html',
  styleUrls: ['./specialize.component.scss']
})
export class SpecializeComponent implements OnInit, OnDestroy {

  // Direction Variables
  lang: string = "en";
  rtlDir: boolean = false;

  defaultSpecializationImg:string = this._DataService.defaultNoImg;
  defaultMedicineImg:string = this._DataService.defaultNoImg;

  // API Subscriptions Variables
  specializeDetailsSubscription = new Subscription();

  specializeDetails :Specialize={
    id: 0,
    name: '',
    description: '',
    photo: ''
  } 



  @Input() specialize:Specialize={
    id: 0,
    name: '',
    description: '',
    photo: ''
  } ;
  @Input() index!:number
  @Output() specializeDetail:EventEmitter<any> = new EventEmitter();

  constructor(private _DataService: DataService, private _FormBuilder:FormBuilder, private router:Router,private _specializeService: SpecializationService) { 

  }

  ngOnInit(): void {
    this.getLang()
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

    //---------Method 2
    getSpecializationDetails(id:number) {
      this._DataService._lang.subscribe({
        next: (lang) => {
          this.lang = lang;
          if (lang == 'en') {
            this.rtlDir = false;
          } else {
            this.rtlDir = true;
          }
          // this.isVisibleSpinner = true;
          console.log(id)
          this.specializeDetailsSubscription = this._specializeService.getSpecializeDetails(lang,id ).subscribe({
            next: (specialize) => {
              console.log(specialize)
              // this.isVisibleSpinner = false;
              this.specializeDetails = specialize.data;
              this.specializeDetail.emit(this.specializeDetails);
              console.log(this.specializeDetails)
              
            },
            error: (error) => {
              console.log(error)
              // this.isVisibleSpinner = false;
            }
          });
        }
      })
    }
  


  onSpecializeClicked(id:number){
    this.getSpecializationDetails(id)

  }
  onSpecialize(specializeDetails:Specialize) {

  }

  
  /*=============================================( Destroying Method )=============================================*/

  ngOnDestroy() {
    this.specializeDetailsSubscription.unsubscribe();
  }
}
