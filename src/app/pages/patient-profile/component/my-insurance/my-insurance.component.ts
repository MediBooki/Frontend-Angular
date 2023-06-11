import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/core/services/data.service';
import { PatientProfileService } from '../../service/patient-profile.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-my-insurance',
  templateUrl: './my-insurance.component.html',
  styleUrls: ['./my-insurance.component.scss']
})
export class MyInsuranceComponent implements OnInit, OnDestroy {

  // constructor & dependency injection
  constructor(private _DataService:DataService, private _PatientProfileService:PatientProfileService, private toastr: ToastrService ,  private router: Router) { }

  ngOnInit(): void {
    this.getLang();
    this.getInsurance();
    this.getPatientInfo();
  }

  /*--------------------------------------------------------------(variables)------------------------------- */

  lang:string = "en";
  rtlDir:boolean = false;
  direction:string = 'ltr';
  allInsurance: any[] = [];
  insuranceAPIres: any;
  insuranceExist:boolean = true;
  totalDiscount:number = 0;
  patientInsurance:{
    company_rate: number,
    discount_percentage: number,
    id: any,
    insurance_code: string,
    insurance_status: any,
    name: string
  } = {
    company_rate: 0,
    discount_percentage: 0,
    id: 0,
    insurance_code: '',
    insurance_status: null,
    name: ''
  };
  insurance_date:any;
  insurance_number:any;
  //add insurance form
  addInsuranceForm = new FormGroup({
    company_id: new FormControl("", [Validators.required]),
    insurance_number : new FormControl("", [Validators.required]),
    expiry_date : new FormControl("", [Validators.required])
  })

  // API Subscriptions Variables
  patientInfoSubscription = new Subscription();
  insuranceSubscription = new Subscription();

/*--------------------------------------------------------------(methods)--------------------------------- */

//----- Method 1
addInsuranceFun(){
   
  if(this.addInsuranceForm.valid){
      const model = {
        "insurance_id": this.addInsuranceForm.value.company_id,
        "insurance_number": this.addInsuranceForm.value.insurance_number,
        "insurance_date": this.addInsuranceForm.value.expiry_date
      }
      this._PatientProfileService.addInsurance(model).subscribe({
        next: (response) => {
           
          this.toastr.success(!this.rtlDir?`Insurance request sent successfully! Please wait confirmation`:`تم ارسال طلبك بنجاح وهو تحت المراجعة`);
          // this.router.navigate(['/home']);
        },
        error : (error)=> {
           
          this.toastr.error(!this.rtlDir?`Something went wrong`:`هناك خطأ ما` );
        }
      })
    }else{
      this.toastr.error(!this.rtlDir?`Please enter all data`:`من فضلك ادخل جميع البيانات` );
    }
}

//----- Method 2
  //----- get all insurance
  getInsurance(){
    this._DataService._lang.subscribe({next:(language)=>{
    // to get all diagnosis
      this.insuranceSubscription = this._PatientProfileService.getInsuranceCompanies(language).subscribe({
      next: (insurance) => {
        this.allInsurance = insurance.data;
        this.insuranceAPIres = insurance;
         
      },
      error: (error) => {
        this.insuranceAPIres = error;
         
      }
      });
    }});
  }

  //----- Method 3
  getPatientInfo() {
    this._DataService._lang.subscribe({
      next:(language)=>{

        this.patientInfoSubscription = this._PatientProfileService.getPatientInfo(this.lang).subscribe({
          next: (patientInfo) => {
             
            this.patientInsurance = patientInfo.data.insurance
            if(patientInfo.data.insurance && patientInfo.data.insurance_status==1){
              this.insuranceExist = true;
              this.insurance_date = patientInfo.data.insurance_date;
              this.insurance_number = patientInfo.data.insurance_number;
              this.totalDiscount = Number(this.patientInsurance.company_rate) + Number(this.patientInsurance.discount_percentage);
              // const discount = Number(patientInfo.data.insurance.discount_percentage) + Number(patientInfo.data.insurance.company_rate)
              // localStorage.setItem("insuranceDiscount", discount.toString())
              // localStorage.setItem("insuranceID",patientInfo.data.insurance.id)
            } else {
              this.insuranceExist = false;

            }
          }
        });
  }})
  }

  //----- Method 4
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

    
  /*=============================================( Destroying Method )=============================================*/

  ngOnDestroy() {
    this.insuranceSubscription.unsubscribe();
    this.patientInfoSubscription.unsubscribe();
  }

}
