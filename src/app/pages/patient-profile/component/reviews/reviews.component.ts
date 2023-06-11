import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/core/services/data.service';
import { PatientProfileService } from '../../service/patient-profile.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit, OnDestroy {
  // constructor & dependency injection
  constructor(private _DataService:DataService, private _PatientProfileService:PatientProfileService, private toastr: ToastrService ,  private router: Router) { }

  ngOnInit(): void {
    this.getLang();
    this.getPatientReviews();
  }

/*--------------------------------------------------------------(variables)------------------------------- */

  lang:string = "en";
  rtlDir:boolean = false;
  direction:string = 'ltr';
  defaultImg:string = this._DataService.defaultNoImg;

  allPatientReviews:any[]=[];
  PatientReviewsAPIres:any;
  allReviews_notempty?:boolean=true;

  // API Subscriptions Variables
  PatientReviewsSubscription = new Subscription();

/*--------------------------------------------------------------(methods)--------------------------------- */

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

  //----- Method 2
  getPatientReviews(){
    this._DataService._lang.subscribe({next:(language)=>{
    // to get all PatientReviews
      this.PatientReviewsSubscription = this._PatientProfileService.getPatientReviews(language).subscribe({
      next: (PatientReviews) => {
        this.allPatientReviews = PatientReviews.data;
        this.PatientReviewsAPIres = PatientReviews;
        this.allReviews_notempty = this.allPatientReviews.length > 0;
         
      },
      error: (error) => {
        this.PatientReviewsAPIres = error;
        this.allReviews_notempty = false;
         
      }
      });
    }});
  }

    
  /*=============================================( Destroying Method )=============================================*/

  ngOnDestroy() {
    this.PatientReviewsSubscription.unsubscribe();
  }

}
