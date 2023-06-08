import { Component, OnInit } from '@angular/core';
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
export class MyInsuranceComponent implements OnInit {

  // constructor & dependency injection
  constructor(private _DataService:DataService, private _PatientProfileService:PatientProfileService, private toastr: ToastrService ,  private router: Router) { }

  ngOnInit(): void {
    this.getLang();
    this.getInsurance();
  }

/*--------------------------------------------------------------(variables)------------------------------- */

  lang:string = "en";
  rtlDir:boolean = false;
  direction:string = 'ltr';
  patientInfoSubscription = new Subscription();
  allInsurance: any[] = [];
  insuranceSubscription = new Subscription();
  insuranceAPIres: any;
  //add insurance form
  addInsuranceForm = new FormGroup({
    company_id: new FormControl("", [Validators.required]),
    insurance_number : new FormControl("", [Validators.required]),
    expiry_date : new FormControl("", [Validators.required])
  })

/*--------------------------------------------------------------(methods)--------------------------------- */

//----- Method 1
addInsuranceFun(){
  console.log(this.addInsuranceForm);
  if(this.addInsuranceForm.valid){
      const model = {
        "insurance_id": this.addInsuranceForm.value.company_id,
        "insurance_number": this.addInsuranceForm.value.insurance_number,
        "insurance_date": this.addInsuranceForm.value.expiry_date
      }
      this._PatientProfileService.addInsurance(model).subscribe({
        next: (response) => {
          console.log(response);
          this.patientInfoSubscription = this._PatientProfileService.getPatientInfo().subscribe({
            next: (patientInfo) => {
              if(patientInfo.data.insurance){
                const discount = Number(patientInfo.data.insurance.discount_percentage) + Number(patientInfo.data.insurance.company_rate)
                localStorage.setItem("insuranceDiscount", discount.toString())
                localStorage.setItem("insuranceID",patientInfo.data.insurance.id)
              }
            }
          });
          this.toastr.success(!this.rtlDir?`Insurance added successfully!`:`تم اضافة تأمينك بنجاح`);
          // this.router.navigate(['/home']);
        },
        error : (error)=> {
          console.log(error.error.data);
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
        console.log(insurance);
      },
      error: (error) => {
        this.insuranceAPIres = error;
        console.log(error);
      }
      });
    }});
  }
  //----- Method 3
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
}
