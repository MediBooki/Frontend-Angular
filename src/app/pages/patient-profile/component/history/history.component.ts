import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/core/services/data.service';
import { PatientProfileService } from '../../service/patient-profile.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit, OnDestroy {
  // constructor & dependency injection
  constructor(private _DataService:DataService, private _PatientProfileService:PatientProfileService, private toastr: ToastrService ,  private router: Router) { }

  ngOnInit(): void {
    this.getLang();
    this.getDiagnosis();
  }
/*--------------------------------------------------------------(variables)------------------------------- */

  lang:string = "en";
  rtlDir:boolean = false;
  direction:string = 'ltr';

  allDiagnosis: any[] = [];
  allDiagnosis_notempty?:boolean=true;
  diagnosisAPIres: any;

  // API Subscriptions Variables
  diagnosisSubscription = new Subscription();

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
  //----- get all diagnosis
  getDiagnosis(){
    this._DataService._lang.subscribe({next:(language)=>{
    // to get all diagnosis
    this.diagnosisSubscription = this._PatientProfileService.getDiagnosis(language).subscribe({
      next: (diagnosis) => {
        this.allDiagnosis = diagnosis.data;
        this.allDiagnosis_notempty = diagnosis.count > 0;
        this.diagnosisAPIres = diagnosis;
        console.log(diagnosis);
      },
      error: (error) => {
        this.diagnosisAPIres = error;
        this.allDiagnosis_notempty = false
        console.log(error);
      }
    });
  }});
  }

  
  /*=============================================( Destroying Method )=============================================*/

  ngOnDestroy() {
    this.diagnosisSubscription.unsubscribe();
  }

}
