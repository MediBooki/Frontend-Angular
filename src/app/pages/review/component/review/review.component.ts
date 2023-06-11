import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/pages/Auth/services/auth.service';
import { DataService } from 'src/app/core/services/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppointmentsService } from 'src/app/pages/appointments/service/appointments.service';
import { ReviewService } from '../../service/review.service';
import { Doctor, reviewDoctor } from 'src/app/core/interfaces/doctor';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { patientReview, updatepatientReview } from 'src/app/core/interfaces/patients';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit, OnDestroy {
  id: any;
  reviewId!: any;

  reviewStatus!:string

  // Direction Variables
  lang: string = "en";
  rtlDir: boolean = false;
  //////////////////////////////////
  // isVisibleSpinner: boolean = true;
  reviewdoctor:reviewDoctor={
    id: 0,
    comment: '',
    rating: 0,
    created_at: '',
    updated_at: '',
    doctor: {
      id: 0,
      name: '',
      specialization: '',
      price: '',
      photo: '',
      start: '',
      end: '',
      patient_time_minute: 0
    }
  }
  doctor: Doctor = {
    id: 0,
    name: '',
    specialization: '',
    price: '',
    photo: '',
    start: {
      hours: 0,
      minutes: 0
    },
    end: {
      hours: 0,
      minutes: 0
    },
    patient_time_minute: 0,
    section: {
      id: 0,
      name: '',
      description: '',
      photo: ''
    },
    appointments: [{
      id: 0,
      name: ''
    }],
    reviews: [{
      id: 0,
      comment: "",
      rating: 0
    }],
    education: '',
    experience: ''
  }
  public formReview!: FormGroup;
  
  // API Subscriptions Variables
  doctorsSubscribtion = new Subscription();
  updateReviewSubscription = new Subscription();
  createReviewSubscription = new Subscription();
  reviewSubscription = new Subscription();
  reviewDoctorSubscription = new Subscription();
  

  defaultDoctorImg:string = this._DataService.defaultNoImg;



  constructor(private _AuthService: AuthService, private _ReviewService: ReviewService, private _DataService: DataService,private route: ActivatedRoute,private _AppointmentsService: AppointmentsService,private fb: FormBuilder , private router: Router, private toastr: ToastrService) { 
    this.id = this.route.snapshot.paramMap.get('id');
    

  }

  createReview() {
    this.formReview = this.fb.group({
      rating1: ['', Validators.required],
      comment : ['' , Validators.required]
    })
  }

  submitReview() {
    this.updateReviewSubscription = this._ReviewService.updatereview.subscribe((res: any) => {
      console.log(res)
      const updatereview = localStorage.getItem('updatereview');
      this.reviewStatus = updatereview ? JSON.parse(updatereview) : false
      console.log(this.reviewStatus === 'false')
      if(this.reviewStatus === 'false'){
        const model: patientReview = {
          doctor_id: parseInt(this.id),
          rating: this.formReview.value.rating1,
          comment: this.formReview.value.comment
        }
        this.createReviewSubscription = this._ReviewService.createReviewPatient(model).subscribe((res: any) => {
          this.toastr.success(!this.rtlDir?`success`:`تم تسجيل تقييم الدكتور` , `${res.message}`)
          this._DataService.is_login.next(true);
          this.router.navigate(['/my-profile/appointments'])
          this._ReviewService.isreview.next(true)
        }, error => {
          this.toastr.error(!this.rtlDir?`An Error has occured`:`حدث خطأ ما` , `${error.error.message}`);
        })
      }else{
        const model: updatepatientReview = {
          id:parseInt( this.reviewId),
          doctor_id: parseInt(this.id),
          rating: this.formReview.value.rating1,
          comment: this.formReview.value.comment
        }
        this.updateReviewSubscription = this._ReviewService.updateReviewPatient(model).subscribe((res: any) => {
          this.toastr.success(!this.rtlDir?`success`:`تم تسجيل تقييم الدكتور` , `${res.message}`)
          this._DataService.is_login.next(true);
          this.router.navigate(['/my-profile/appointments'])
          this._ReviewService.isreview.next(true)
        }, error => {
          this.toastr.error(!this.rtlDir?`An Error has occured`:`حدث خطأ ما` , `${error.error.message}`);
        })
      }
    })
  }

  ngOnInit(): void {
    // Promise.resolve().then(() => this._DataService.isPageLoaded.next(false));
    // Promise.resolve().then(() => this._AuthService.isLogedIn.next(true));
    this.getDoctorById();
    this.getLang();
    this.createReview();
    // this.route.queryParams.subscribe(params => {
    //   this.reviewId = params['id'];
    // });
    this.reviewId = this.route.snapshot.paramMap.get('id');
    this.getreviewPatient()
    console.log(this.reviewId)
  }

  // // when view load completely
  // ngAfterViewInit() {
  //   setTimeout(() => {
  //     Promise.resolve().then(() => this._DataService.isPageLoaded.next(true))
  //   }, 0);
  // }
  /////////////////////////////////////////////
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

  getDoctorById() {
    this._DataService._lang.subscribe({

      next: (lang) => {
        this.lang = lang;
        if (lang == 'en') {
          this.rtlDir = false;
        } else {
          this.rtlDir = true;
        }
        // this.isVisibleSpinner = true;
        this.reviewSubscription = this._AppointmentsService.getDoctorById(lang, this.id).subscribe({
          next: (Doctor) => {
            console.log(Doctor)
            this.doctor = Doctor.data;
            console.log(this.doctor)
            // this.isVisibleSpinner = false;
          },
          error: (error) => {
            // this.noDataError = error;
            // this.isVisibleSpinner = false;
          }
        });
      }
    })
  }

  getreviewPatient(){
    this.reviewDoctorSubscription = this._ReviewService.getReviewPatient(this.id).subscribe({
      next: (reviewDoctor) => {
        console.log(reviewDoctor.data)
        this.reviewdoctor = reviewDoctor.data;
        console.log(this.reviewdoctor)
        this.formReview.get("rating1")?.setValue(this.reviewdoctor.rating);
        this.formReview.get("comment")?.setValue(this.reviewdoctor.comment);
        // this.isVisibleSpinner = false;
      },
      error: (error) => {
        // this.noDataError = error;
        // this.isVisibleSpinner = false;
      }
    });
  }


  /*=============================================( Destroying Method )=============================================*/

  ngOnDestroy() {
    this.reviewSubscription.unsubscribe();
    this.doctorsSubscribtion.unsubscribe();
    this.createReviewSubscription.unsubscribe();
    this.reviewDoctorSubscription.unsubscribe();
    this.updateReviewSubscription.unsubscribe();
  }

}
