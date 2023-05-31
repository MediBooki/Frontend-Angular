import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Specialize } from 'src/app/core/interfaces/specialize';
import { DataService } from 'src/app/core/services/data.service';
import { SpecializationService } from '../../service/specializations.service';
import { AuthService } from 'src/app/pages/Auth/services/auth.service';
import { Roadmap } from 'src/app/core/interfaces/roadmap';

@Component({
  selector: 'app-specialize-details',
  templateUrl: './specialize-details.component.html',
  styleUrls: ['./specialize-details.component.scss']
})
export class SpecializeDetailsComponent implements OnInit {
  // isVisibleSpinner:boolean = false;
  // Direction Variables
  rtlDir:boolean = false;
  lang:string = "en";
  direction:string = "ltr";

  defaultMedicineImg:string = this._DataService.defaultNoImg;


  specializeId!: any;


  // roadmap variable
  roadMapLinks:Roadmap = {
    roadMabFirstLink: {arabic:'الرئيسية',english:'Home',link:'/home'},
    roadMabLastLink: {arabic:'تفاصيل القسم',english:'specialize Details'},
    roadMabIntermediateLinks: [
      {arabic:'الاقسام',english:'Specialities',link:'/specializations'}
    ]
  }

  constructor(private _DataService:DataService,private _specializeService: SpecializationService,private route: ActivatedRoute, private _AuthService: AuthService, private _FormBuilder:FormBuilder, private router:Router) { 
    this._specializeService.idspecialize.subscribe((res :any) => {

      // console.log(res)
      this.specializeId = res
      // console.log(this.specializeId)
    }
    );
    console.log(this.specializeId)

  }

  ngOnInit(): void {
    // Promise.resolve().then(() => this._AuthService.isLogedIn.next(true));
    // Promise.resolve().then(() => this._DataService.isPageLoaded.next(false));
    this.getLang()

  }

  // // when view load completely
  // ngAfterViewInit() {
  //   setTimeout(() => {
  //     Promise.resolve().then(()=>this._DataService.isPageLoaded.next(true))
  //   },0);
  // }

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



  // (click)="filterDoctors(specialize.id, specialize.name)"
}
