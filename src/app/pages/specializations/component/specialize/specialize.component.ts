import { Component, Input, OnInit } from '@angular/core';
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
export class SpecializeComponent implements OnInit {

  // Direction Variables
  lang: string = "en";
  rtlDir: boolean = false;

  defaultSpecializationImg:string = this._DataService.defaultNoImg;
  defaultMedicineImg:string = this._DataService.defaultNoImg;


  specializeDetailsSubscription = new Subscription();
  specializeDetails :Specialize={
    id: 0,
    name: '',
    description: '',
    photo: ''
  } 
  filterForm : FormGroup;



  @Input() specialize!:Specialize;
  @Input() index!:number

  constructor(private _DataService: DataService, private _FormBuilder:FormBuilder, private router:Router,private _specializeService: SpecializationService) { 
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

  onSpecializeClicked(id:number){
    this.getSpecializationDetails(id)

  }

  



}
