import { Appointments } from 'src/app/core/interfaces/appointments';
import { Section } from 'src/app/core/interfaces/section';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from 'src/app/core/services/data.service';
import { AuthService } from 'src/app/pages/Auth/services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import * as $ from 'jquery';
import 'select2';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DoctorJoin } from 'src/app/core/interfaces/doctor-join';
import { DoctorRegisterService } from '../../service/doctor-register.service';
import { SpecializationService } from 'src/app/pages/specializations/service/specializations.service';

@Component({
  selector: 'app-doctor-register',
  templateUrl: './doctor-register.component.html',
  styleUrls: ['./doctor-register.component.scss']
})
export class DoctorRegisterComponent implements OnInit {
/*=============================================( Initialization Methods )=============================================*/
  constructor(private _DataService:DataService, private _AuthService: AuthService , private _TranslateService:TranslateService,  private router: Router, private toastr: ToastrService,private _DoctorRegisterService:DoctorRegisterService, private _SpecializationService:SpecializationService) { }


  ngOnInit(): void {
    Promise.resolve().then(()=>this._DataService.isPageLoaded.next(false));
    Promise.resolve().then(() => this._AuthService.isLogedIn.next(true));
    this.getLang();
    this.getSections();
    this.getAppointments();
    this.runSelect2('gender-select2',"Choose Gender","اختر الجنس");
    this.runSelect2('section-select2',"Choose Section", "اختر القسم");
    this.runSelect2('title-select2',"Choose Title", "اختر المسمى الوظيفي");
    this.dropdownList = [];
    this.dropdownSettings = {
      idField: 'id',
      textField: 'name',
    };
  }

  // when view load completely
  ngAfterViewInit() {
    setTimeout(() => {
      Promise.resolve().then(()=>this._DataService.isPageLoaded.next(true))
    }, 0);
  }

  /*=============================================( Variables )=============================================*/
  // multiselect var
  dropdownList:any = [];
  dropdownSettings:IDropdownSettings={};
  fileName = ""

  lang:string = "en";
  rtlDir:boolean = false;
  direction:any = 'ltr' ;
  stepNum:number = 1;

  page:number=1

  // API Variables
  allSections: Section[] = [];
  sectionsSubscription = new Subscription();
  allAppointments: Appointments[] = [];
  appointmentsSubscription = new Subscription();

  // Other Variables
  noDataError: any; // in case of error
  appointments_id=new Array<any>();
  selectedItems: Appointments[]=[];
  formdata?: any;
  formSuccess?: boolean;
  formAPIerrors?: any;

  //form
  joinusForm = new FormGroup({
    name_en: new FormControl("", [Validators.required, Validators.minLength(5), Validators.maxLength(20)]),
    name : new FormControl("", [Validators.required, Validators.minLength(5), Validators.maxLength(20)]),
    email : new FormControl("", [Validators.required, Validators.email]),
    phone : new FormControl("", [Validators.required, Validators.pattern(/^\+?(002)?[\d\s()-]{4,}$/)]),
    password : new FormControl("", [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/)]),
    re_password : new FormControl("", [Validators.required]),
    // Min 1 uppercase letter,Min 1 lowercase letter.,Min 1 special character.,Min 1 number.,Min 8 characters.,Max 30 characters.
    photo : new FormControl("", [Validators.required]),
    // gender : new FormControl("", [Validators.required]),
    // section_id : new FormControl("", [Validators.required]),
    // title : new FormControl("", [Validators.required]),
    specialization : new FormControl("", [Validators.required,Validators.minLength(8), Validators.maxLength(20)]),
    start : new FormControl("", [Validators.required]),
    end : new FormControl("", [Validators.required]),
    patient_time_minute : new FormControl("", [Validators.required,Validators.min(1)]),
    price : new FormControl("", [Validators.required,Validators.min(1)]),
    appointments : new FormControl("", [Validators.required]),
    experience :  new FormControl("", [Validators.required]),
    experience_en :  new FormControl("", [Validators.required]),
    education :  new FormControl("", [Validators.required]),
    education_en :  new FormControl("", [Validators.required]),

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
      this.runSelect2('gender-select2',"Choose Gender","اختر الجنس");
      this.runSelect2('section-select2',"Choose Section", "اختر القسم");
      this.runSelect2('title-select2',"Choose Title", "اختر المسمى الوظيفي");
    }})
  }

  //----- Method 2
  stepForward(){
    if (this.stepNum<5) {
      this.stepNum ++;
    }else{
      this.stepNum = 1;
    }
    console.log(this.stepNum);
  }

  //----- Method 2
  stepbackward(){
    if (this.stepNum>1) {
      this.stepNum --;
    }else{
      this.stepNum = 5;
    }
    console.log(this.stepNum);
  }

  //----- Method 3
  //----- get all sections
  getSections(){
    this._DataService._lang.subscribe({next:(language)=>{
      // to get all sections
    this.sectionsSubscription = this._SpecializationService.getSpecialization(language , this.page).subscribe({
      next: (sections) => {
        this.allSections = sections.data;
      },
      error: (error) => {
        this.noDataError = error;
      }

    });
    }});
  }

  //----- Method 4
  getFormData(){
    console.log(this.joinusForm)
    console.log($('.gender-select2').select2('data')[0].id)

    if(this.joinusForm.valid){
      if(this.joinusForm.controls.re_password.value == this.joinusForm.controls.password.value){
        this.selectedItems.forEach(element => {
          this.appointments_id.push(element.id);
        });
        console.log(this.appointments_id);
        this.appointments_id = this.appointments_id.sort();
        console.log(this.appointments_id);

        const model: DoctorJoin = {
          name_en:this.joinusForm.value.name_en,
          name:this.joinusForm.value.name,
          email:this.joinusForm.value.email,
          phone:this.joinusForm.value.phone,
          password:this.joinusForm.value.password,
          photo:this.joinusForm.value.photo,
          gender:$('.gender-select2').select2('data')[0].id,
          section_id:$('.section-select2').select2('data')[0].id,
          title:$('.title-select2').select2('data')[0].id,
          specialization:this.joinusForm.value.specialization,
          start:this.joinusForm.value.start,
          end:this.joinusForm.value.end,
          patient_time_minute:this.joinusForm.value.patient_time_minute,
          price:this.joinusForm.value.price,
          appointments:Array.from(this.appointments_id),
          experience: this.joinusForm.value.experience,
          experience_en: this.joinusForm.value.experience_en,
          education: this.joinusForm.value.education,
          education_en: this.joinusForm.value.education_en,
        }
        this.formdata = new FormData();
        Object.entries(model).forEach(([key , value] : any) => {
          if(key=="appointments") {
            for (let i = 0; i < this.appointments_id.length; i++) {
              this.formdata.append(`appointments[${i}]`, this.appointments_id[i])
            }
          } else {
            this.formdata.append(key , value)

          }
        })
        this._DoctorRegisterService.doctorJoinus(this.formdata).subscribe({
          next: (response) => {
            console.log(response);
            this.formSuccess = true;
            this.toastr.success(!this.rtlDir?`successfully registered we will contact you soon!`:`تم التسجيل بنجاح وسيتم التواصل معك قريبا`);
            this.router.navigate(['/home']);
          },
          error : (error)=> {
            console.log(error);
            this.formSuccess = false;
            this.formAPIerrors = error.error.errors
            this.toastr.error(!this.rtlDir?`An Error has occured`:`حدث خطأ ما` )
            console.log(this.formAPIerrors);

          }
          })
      }
    }
  }

  //----- Method 5
  //run select2
  runSelect2(x:string,placeholder_en:any, placeholder_ar:any){
      $('.'+x).select2({
        placeholder: this.rtlDir?placeholder_ar:placeholder_en,
        dir:this.direction
      });
  }

  //----- Method 6
  //----- get all appointment
  getAppointments(){
    this._DataService._lang.subscribe({next:(language)=>{
      // to get all sections
    this.appointmentsSubscription = this._DoctorRegisterService.getAppointments(language).subscribe({
      next: (appointments) => {
        this.allAppointments = appointments.data;
        this.dropdownList = this.allAppointments;
      },
      error: (error) => {
        this.noDataError = error;
      }

    });
    }});
  }

  //----- Method 7
  onFileChange(event: any) {


    this.fileName = event.target.value
    this.joinusForm.get('photo')?.setValue(event.target.files[0])

    // const file = event.target.files[0];
    // console.log(file);
    // // Create a new FormData object
    // this.formdata = new FormData();
    // this.formdata.set('file', file, file.name);
    // console.log(this.formdata)

  }

  ngOnDestroy() {
    this.runSelect2('gender-select2',"Choose Gender","اختر الجنس");
    this.runSelect2('section-select2',"Choose Section", "اختر القسم");
    this.runSelect2('title-select2',"Choose Title", "اختر المسمى الوظيفي");
  }

}
