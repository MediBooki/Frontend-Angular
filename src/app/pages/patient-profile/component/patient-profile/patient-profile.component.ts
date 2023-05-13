import { DataService } from 'src/app/core/services/data.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/pages/Auth/services/auth.service';
import { ReviewService } from 'src/app/pages/review/service/review.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Medicine } from 'src/app/core/interfaces/medicine';
import { CartService } from 'src/app/pages/cart/service/cart.service';
import { PatientProfileService } from '../../service/patient-profile.service';
import { reviews } from 'src/app/core/interfaces/patients';

@Component({
  selector: 'app-patient-profile',
  templateUrl: './patient-profile.component.html',
  styleUrls: ['./patient-profile.component.scss']
})
export class PatientProfileComponent implements OnInit, OnDestroy {

  constructor(private _AuthService: AuthService,private _ReviewService:ReviewService, private _DataService:DataService, private _PatientProfileService:PatientProfileService, private toastr: ToastrService ,  private router: Router,private _cartservice : CartService) { }

  ngOnInit(): void {
    Promise.resolve().then(() => this._AuthService.isLogedIn.next(true));
    Promise.resolve().then(() => this._DataService.isPageLoaded.next(false));
    this._DataService.curruntService.subscribe(
      res=>{ this.curruntService = res; }
    )
    this._ReviewService.isreview.subscribe(
      res=>{ this.isReview = res; console.log(this.isReview)}
    )
    this.isVisibleSpinner = true;
    this.getLang();
    this.getDiagnosis();
    this.getInsurance();
    this.getPatientInfo();
    this.getMedicines();
    this._DataService.userPhoto.subscribe(res => {
      this.userPhoto = res
    });
    this.getInvoices();
    this.getOrders();
    this.getAppointments();
    this.getPatientReviews();
    this.setFavorite();
  }
  // when view load completely
  ngAfterViewInit() {
    setTimeout(() => {
      Promise.resolve().then(()=>this._DataService.isPageLoaded.next(true))
    },0);
  }

  /*=============================================( Variables )=============================================*/
  lang:string = "en";
  rtlDir:boolean = false;
  direction:string = 'ltr';
  is_login: boolean= false;
  islogsub = this._DataService.is_login.subscribe(res => {
      this.is_login = res
    });
  curruntService: string = 'details';
  isReview!:boolean
  curruntColNum:number = 1;
  AppointmentCurruntColNum:number = 1;
  showPass: boolean = false;
  isVisibleSpinner:boolean = false;
  updatePhoto:any;
  updateFormdata?: any;
  userPhoto?:string= "../../../assets/images/user_male.jpeg" ;
  colDataIndex:number =0
  appointmentColDataIndex:number =0
  updateReviewBtn!:boolean
  reviewBtn!:boolean
  reviewId?:number

  // API Variables
  allDiagnosis: any[] = [];
  allDiagnosis_notempty?:boolean=true;
  diagnosisSubscription = new Subscription();
  diagnosisAPIres: any;
  allInsurance: any[] = [];
  insuranceSubscription = new Subscription();
  insuranceAPIres: any;
  patientInfoSubscription = new Subscription();
  patientInfoAPIres: any;
  patientInfo: any = "";
  patientName?: string;
  favMedicines:Medicine[] = [];
  medicinesSubscription = new Subscription();
  favMedicinesAPIres: any;
  allFav_notempty?:boolean=true;
  allInvoices:any[]=[];
  invoicesSubscription = new Subscription();
  invoicesAPIres:any;
  allInvoices_notempty?:boolean=true;
  orders:any[]=[];
  ordersSubscription = new Subscription();
  ordersAPIres:any;
  allOrders_notempty?:boolean=true;
  Appointments:any[]=[];
  AppointmentsSubscription = new Subscription();
  AppointmentsAPIres:any;
  allAppointment_notempty?:boolean=true;
  allPatientReviews:any[]=[];
  PatientReviewsSubscription = new Subscription();
  PatientReviewsAPIres:any;
  allReviews_notempty?:boolean=true;
  orderDetails:any;
  oneOrderSubscription = new Subscription();
  oneOrderAPIres:any;

  //change password form
  changePassword = new FormGroup({
    old_password: new FormControl("", [Validators.required]),
    password : new FormControl("", [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/)]),
    password_confirmation : new FormControl("", [Validators.required]),
    showpasscont : new FormControl()
  })

  //update profile form
  updateProfile = new FormGroup({
    name: new FormControl("", [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z]{1,}[a-zA-Z0-9]*$/)]),
    phone : new FormControl("", [Validators.required]),
    address : new FormControl("", [Validators.required]),
    photo : new FormControl("", [Validators.required])

  })

  //add insurance form
  addInsuranceForm = new FormGroup({
    company_id: new FormControl("", [Validators.required]),
    insurance_number : new FormControl("", [Validators.required]),
    expiry_date : new FormControl("", [Validators.required])
  })


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

  //----- Method 2
  getServive(name:string){
    this.curruntService = name;
    console.log(this.patientInfo)
  }

  //----- Method 3
  changePasswordFun(){
    console.log(this.changePassword);
    if(this.changePassword.valid){
      if(this.changePassword.controls.password_confirmation.value == this.changePassword.controls.password.value){
        const model = {
          "old_password": this.changePassword.value.old_password,
          "password": this.changePassword.value.password,
          "password_confirmation": this.changePassword.value.password_confirmation
        }
        this._PatientProfileService.changePassword(model).subscribe({
          next: (response) => {
            console.log(response);
            this.toastr.success(!this.rtlDir?`Password changed successfully!`:`تم تغيير كلمة المرور بنجاح`);
            this.router.navigate(['/home']);
          },
          error : (error)=> {
            console.log(error.error.data);
            if(error.error.data == 'wrong old password'){
              this.toastr.error(!this.rtlDir?`Wrong old password`:`كلمة المرور الحالية خاطئة` )
            }
          }
        })
      }else{
        this.toastr.error(!this.rtlDir?`Password confirmation and password doesn't match`:`تأكيد كلمة المرور وكلمة المرور غير متطابقين` );
      }
    }
  }

  //----- Method 4
  showPassword(){
    this.showPass = this.changePassword.value.showpasscont
  }

  //----- Method 5
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
        console.log(error);
      }
    });
  }});
  }

  //----- Method 6
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

  //----- Method 7
  //----- get all insurance
  getPatientInfo(){
    this.patientInfoSubscription = this._PatientProfileService.getPatientInfo().subscribe({
      next: (patientInfo) => {
        this.patientInfo = patientInfo.data;
        this.patientName = patientInfo.data.name
        console.log(this.patientInfo)
        this.patientInfoAPIres = patientInfo;
        console.log(patientInfo);
        if(this.patientInfo.photo != ''){
          this._DataService.userPhoto.next(this.patientInfo.photo)
          // this.userPhoto = this.patientInfo.photo;
        }
        this.isVisibleSpinner = false;

        //update profile form
        // this.updateProfile = new FormGroup({
        //   name: new FormControl(this.patientName, [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z]{1,}[a-zA-Z0-9]*$/)]),
        //   phone : new FormControl("", [Validators.required]),
        //   address : new FormControl("", [Validators.required])
        // })
      },
      error: (error) => {
        this.patientInfoAPIres = error;
        console.log(error);
      }
    });
  }

  //----- Method 8
  updateProfileSupmit(){
      const model = {
        "photo" : this.updatePhoto,
        "name": this.updateProfile.value.name,
        "phone": this.updateProfile.value.phone,
        "address": this.updateProfile.value.address
      }
      console.log(model)
      this.updateFormdata = new FormData();
      Object.entries(model).forEach(([key , value] : any) => {
        if(key=='name' && value==''){
          this.updateFormdata.append(key , this.patientInfo.name);
        }else if(key=='phone' && value==''){
          this.updateFormdata.append(key , this.patientInfo.phone);
        }else if(key=='address' && value==''){
          this.updateFormdata.append(key , this.patientInfo.address);
        }else{
          this.updateFormdata.append(key , value);
        }
      })
      console.log(this.updateFormdata)
      this._PatientProfileService.updateProfile(this.updateFormdata).subscribe({
        next: (response) => {
          console.log(response);
          this.toastr.success(!this.rtlDir?`profile updated successfully!`:`تم تحديث الملف الشخصي بنجاح`);
          this.getPatientInfo();
        },
        error : (error)=> {
          console.log(error);
        }
      })
  }

  //----- Method 9
  getMedicines() {
      // to get all Favorites
      this.isVisibleSpinner = true
      this.medicinesSubscription = this._cartservice.getAllFavorite().subscribe({
        next: (favMedicines) => {
          this.favMedicines = favMedicines.data;
          this.favMedicinesAPIres = favMedicines;
          this.allFav_notempty = this.favMedicines.length > 0;
          console.log( this.favMedicines);
          this.isVisibleSpinner = false;
        },
        error: (error) => {
          this.favMedicinesAPIres = error;
          console.log(error);
          this.isVisibleSpinner = false;
        }
      });
  }

  //----- Method 10
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

  //----- Method 11
  onFileChange(event: any) {
    this.updatePhoto = event.target.files[0];
  }

  //----- Method 12
  //----- get all invoices
  getInvoices(){
    this._DataService._lang.subscribe({next:(language)=>{
    // to get all diagnosis
      this.invoicesSubscription = this._PatientProfileService.getInvoices(language).subscribe({
      next: (invoices) => {
        this.allInvoices = invoices.data;
        this.invoicesAPIres = invoices;
        this.allInvoices_notempty = this.allInvoices.length > 0;
        console.log(invoices);
      },
      error: (error) => {
        this.invoicesAPIres = error;
        console.log(error);
      }
      });
    }});
  }

  //----- Method 13
  getOrders(){
    // to get all orders
    this.ordersSubscription = this._PatientProfileService.getOrders().subscribe({
      next: (orders) => {
        this.orders = orders.data;
        this.ordersAPIres = orders;
        this.allOrders_notempty = this.orders.length > 0;
        console.log( orders);
      },
      error: (error) => {
        this.ordersAPIres = error;
        console.log(error);
      }
    });
  }


  //----- Method 14
  nextcol(){
    if(this.curruntColNum<4){
      this.curruntColNum++;
    }else{
      this.curruntColNum=1;
    }
    console.log(this.curruntColNum);
  }

  //----- Method 14
  previousCol(){
    if(this.curruntColNum>1){
      this.curruntColNum--;
    }else{
      this.curruntColNum=4;
    }
    console.log(this.curruntColNum);
  }
  //----- Method 14
  gitColData(i:number){
    this.colDataIndex = i;
  }

  //----- Method 15
  nextcolAppointment(){
    if(this.AppointmentCurruntColNum<4){
      this.AppointmentCurruntColNum++;
    }else{
      this.AppointmentCurruntColNum=1;
    }
    console.log(this.AppointmentCurruntColNum);
  }

  //----- Method 16
  previousColAppointment(){
    if(this.AppointmentCurruntColNum>1){
      this.AppointmentCurruntColNum--;
    }else{
      this.AppointmentCurruntColNum=4;
    }
    console.log(this.AppointmentCurruntColNum);
  }

  //----- Method 17
  appointmentGetColData(i:number , id:number , Dateapp:string){
    this.appointmentColDataIndex = i;
    console.log(i)
    const date = new Date(Dateapp)
    const currentDate = new Date();

    if(this.allPatientReviews.find(r => r.doctor.id  === id ) && currentDate >= date  ){
      this.reviewId = this.allPatientReviews.find(r => r.doctor.id  === id )?.id
      console.log(this.reviewId)
      console.log(this.allPatientReviews.find(r => r.doctor.id  === id ))
      this.updateReviewBtn=true
      this.reviewBtn = false
      this._DataService.idReview.next(this.allPatientReviews.find(r=> r.doctor.id == id )!.id)
      console.log(this._DataService.idReview)
    }else if(currentDate >= date && !this.allPatientReviews.find(r => r.doctor.id  === id )){
      this.updateReviewBtn=false
      this.reviewBtn = true
    }else{
      this.updateReviewBtn=false
      this.reviewBtn = false
    }
  }

  //----- Method 18
  getAppointments(){
    this._DataService._lang.subscribe({next:(language)=>{
    // to get all diagnosis
      this.AppointmentsSubscription = this._PatientProfileService.getPatientAppointments(language).subscribe({
      next: (Appointments) => {
        this.Appointments = Appointments.data;
        this.AppointmentsAPIres = Appointments;
        this.allAppointment_notempty = this.Appointments.length > 0;
        console.log(this.Appointments);
      },
      error: (error) => {
        this.AppointmentsAPIres = error;
        console.log(error);
      }
      });
    }});
  }
  //----- Method 19
  getOrderData(id:number){
    this._DataService._lang.subscribe({next:(language)=>{
      // to get all diagnosis
        this.oneOrderSubscription = this._PatientProfileService.getOrderDetails(id,language).subscribe({
        next: (order) => {
          this.orderDetails = order.data;
          this.oneOrderAPIres = order;
          console.log(order);
        },
        error: (error) => {
          this.oneOrderAPIres = error;
          console.log(error);
        }
        });
      }});
  }

  //----- Method 20
  getifUpdate(check :number){
    if(check == 1){
      // this._DataService.updatereview.next(true)
      localStorage.setItem('updatereview', JSON.stringify(true));
      // console.log(this._DataService.updatereview)
    }else{
      // this._DataService.updatereview.next(false)
      localStorage.setItem('updatereview', JSON.stringify(false));
    }

  }

    //----- Method 21
  getPatientReviews(){
    this._DataService._lang.subscribe({next:(language)=>{
    // to get all PatientReviews
      this.PatientReviewsSubscription = this._PatientProfileService.getPatientReviews(language).subscribe({
      next: (PatientReviews) => {
        this.allPatientReviews = PatientReviews.data;
        this.PatientReviewsAPIres = PatientReviews;
        this.allReviews_notempty = this.allPatientReviews.length > 0;
        console.log(PatientReviews);
      },
      error: (error) => {
        this.PatientReviewsAPIres = error;
        console.log(error);
      }
      });
    }});
  }

  setFavorite() {
    let favoritesId:number[] = []
      if (localStorage.getItem("token") != null) {
        if(this._cartservice.favoritesId.value.length == 0) {
          this._cartservice.getAllFavorite().subscribe({
          next:(favorites)=>{
            console.log(favorites.data)
            favorites.data.forEach((favMedicine:any)=>{
              favoritesId.push(favMedicine.id)
            })
            this._cartservice.favoritesId.next(favoritesId);
            console.log(favoritesId)
          }
        })
      }
    }
  }

  ngOnDestroy(){
    this._DataService.curruntService.next("details");
  }
}
