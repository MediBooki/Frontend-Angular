import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Specialize } from 'src/app/core/interfaces/specialize';
import { DataService } from 'src/app/core/services/data.service';
import { SpecializationService } from '../../service/specializations.service';
import { AuthService } from 'src/app/pages/Auth/services/auth.service';

@Component({
  selector: 'app-specialize-details',
  templateUrl: './specialize-details.component.html',
  styleUrls: ['./specialize-details.component.scss']
})
export class SpecializeDetailsComponent implements OnInit {
  isVisibleSpinner:boolean = false;
  // Direction Variables
  rtlDir:boolean = false;
  lang:string = "en";
  direction:string = "ltr";

  defaultMedicineImg:string = this._DataService.defaultNoImg;

  specializeDetailsSubscription = new Subscription();
  specializeDetails :Specialize={
    id: 0,
    name: '',
    description: '',
    photo: ''
  } 
  specializeId!: any;
  filterForm : FormGroup;

  constructor(private _DataService:DataService,private _specializeService: SpecializationService,private route: ActivatedRoute, private _AuthService: AuthService, private _FormBuilder:FormBuilder, private router:Router) { 
    this.specializeId = this.route.snapshot.paramMap.get('id');
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
    Promise.resolve().then(() => this._AuthService.isLogedIn.next(true));
    Promise.resolve().then(() => this._DataService.isPageLoaded.next(false));
    this.getLang()
    this.getSpecializationDetails()
  }

  // when view load completely
  ngAfterViewInit() {
    setTimeout(() => {
      Promise.resolve().then(()=>this._DataService.isPageLoaded.next(true))
    },0);
  }

  /*=============================================( Component Created Methods )=============================================*/

  //----- Method 1
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

  //---------Method 2
  getSpecializationDetails() {
    this._DataService._lang.subscribe({
      next: (lang) => {
        this.lang = lang;
        if (lang == 'en') {
          this.rtlDir = false;
        } else {
          this.rtlDir = true;
        }
        this.isVisibleSpinner = true;
        this.specializeDetailsSubscription = this._specializeService.getSpecializeDetails(lang,this.specializeId ).subscribe({
          next: (specialize) => {
            console.log(specialize)
            this.isVisibleSpinner = false;
            this.specializeDetails = specialize.data;
            console.log(this.specializeDetails)
            
          },
          error: (error) => {
            console.log(error)
            this.isVisibleSpinner = false;
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

  // (click)="filterDoctors(specialize.id, specialize.name)"
}
