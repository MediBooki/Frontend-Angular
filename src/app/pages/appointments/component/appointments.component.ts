import { Time } from 'src/app/core/interfaces/time';
import { Doctor } from './../../../core/interfaces/doctor';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';
import { AuthService } from '../../Auth/services/auth.service';
import { AppointmentsService } from '../service/appointments.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, timestamp } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AppointmentsPatient, patientAppointment } from 'src/app/core/interfaces/patients';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import 'select2';
import * as $ from 'jquery';
import { SafeHtml ,DomSanitizer } from '@angular/platform-browser';



@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss']
})
export class AppointmentsComponent implements OnInit {

  /*=============================================( Variables )=============================================*/

  //form variables
  patientAppointmentForm!: FormGroup;
  patientName!: FormControl;
  patientAge!: FormControl;
  patientemail!: FormControl;
  phoneNumberPatient!: FormControl;
  time!: FormControl;
  

  // Direction Variables
  lang: string = "en";
  rtlDir: boolean = false;
  direction: any = 'ltr';
  
  // Other Variables
  noDataError: any; // in case of error
  singleDoctorId:any
  Patient_idStr: any = localStorage.getItem('patient_id');
  Patient_idNum = parseInt(this.Patient_idStr)
  noReviews:boolean = false;

  isVisibleSpinner: boolean = false;
  overallRating:number = 0
  htmlCode!: SafeHtml;

  addClass:boolean = false


  
  // API Variables
  appointmentSubscription = new Subscription();
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
  reviews:any[]=[]
  displayedReviews:any[]=[]
  fixedDisplayCount=2
  displayCount = 2; // Number of reviews to display initially
  incrementCount = 1; // Number of reviews to increment on "Show More" button click

  
  
  bookSubscription = new Subscription();
  listOfBook!: patientAppointment[]
  
  bookDaySubscription = new Subscription();
  listOfDayBook!: patientAppointment[]
  timeBookList: any[] = [];
  filterintervals: any[] = []



  // Time Variables
  startDate!: any;
  endDate: any;
  duration: number = 30;
  intervals: any[] = [];
  selectedtime!: string;
  selectedDay!: string;
  dayIndex: any
  desiredDayOfWeek!: number
  earliestDate!: Date
  convertDate!: any


// on click on time this istimeActive is true
activeIndex = null;


  defaultDoctorImg:string = this._DataService.defaultNoImg;


  /*=============================================( Initialization Methods )=============================================*/

  constructor(private _AuthService: AuthService, private _DataService: DataService, private _AppointmentsService: AppointmentsService, private route: ActivatedRoute, private fb: FormBuilder, private router: Router, private datePipe: DatePipe, private toastr: ToastrService , private sanitizer: DomSanitizer) {
    this.singleDoctorId = this.route.snapshot.paramMap.get('id');
    //  
    //  
  }

  ngOnInit(): void {
    this._DataService.firstSectionHeight = this.firstSection?.nativeElement.offsetHeight;

    this.getLang();
    this.getBookDoctorList(this.convertDate)
    this.getDoctorById();
    this.initFormControl();
    this.createForm();
    this.runSelect();
    this.htmlCode = this.sanitizer.bypassSecurityTrustHtml('<p>This is the HTML code to render. Click <a class="btn btn-primary me-2" (click)="navigateToDestination()">here</a> to navigate.</p>');

  }
  navigateToDestination() {
    this.router.navigate(['/doctors']);
  }


  // when view load completely
  // ngAfterViewInit() {
  //   setTimeout(() => {
  //     Promise.resolve().then(() => this._DataService.isPageLoaded.next(true))
  //   }, 0);
  // }

  
  /*=============================================( Component Created Methods )=============================================*/

    //----- Method 1
    @ViewChild('firstSection') firstSection: ElementRef | undefined;
    @HostListener('window:scroll') // method triggered every scroll
    checkScroll() {
      this._DataService.firstSectionHeight = this.firstSection?.nativeElement.offsetHeight;
    }

    /*---------------------------------------------( API )---------------------------------------------*/

    /////////////////////////////////////////////
    // to subscribe in language to know in case of changing
    getLang() {
      this._DataService._lang.subscribe({
        next: (language) => {

          this.lang = language;
          if (language == 'en') {
            this.rtlDir = false;
            this.direction='ltr';
          } else {
            this.rtlDir = true;
            this.direction='rtl';
          }
          this.runSelect()
        }
        
      })
    }


      ///////////////////////////////////////////////
    // to get doctors by subscribing on API
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
          this.appointmentSubscription = this._AppointmentsService.getDoctorById(lang, this.singleDoctorId).subscribe({
            next: (Doctor) => {
               

              this.doctor = Doctor.data;
              this.startDate = this.doctor.start;
              this.endDate = this.doctor.end;
              this.duration = this.doctor.patient_time_minute;
              this.reviews = this.doctor.reviews;
              this.noReviews = this.reviews.length>0 ? false : true
               
              this.displayedReviews = this.reviews.slice(0, this.displayCount);
               
              let sum = 0;

              this.doctor.reviews.forEach((doctorReview)=>{
                sum = sum + doctorReview.rating
              })
              this.overallRating = sum / this.doctor.reviews.length;
              this.calculateIntervals();
            },
            error: (error) => {
              this.noDataError = error;
              this.toastr.error("There is no such doctor on the site");
              this.router.navigate(['/doctors'])
            }
          });
        }
      })
    }


    //This function that takes in a day as an argument and returns the index of that day in the week
    getDayIndex(day: any) {
      if (typeof day === 'string' && day !== 'null') {
        const dayName = day.toLowerCase();
         
        if(localStorage.getItem('lang') == 'en'){
          const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
          const index = daysOfWeek.indexOf(dayName);
          return index;

        }else{
          const daysOfWeek = ['الاحد', 'الاثنين', 'الثلاثاء', 'الاربعاء', 'الخميس', 'الجمعة', 'السبت'];
          const index = daysOfWeek.indexOf(dayName);
          return index;
        }
      } else {
        return null;
      }
    }

      //This function is used to select a day of the week and then convert it into a date format
  onDaySelect(day: any) {
    this.selectedDay = day; // Bind the selected day value to the component property
     
    this.dayIndex = this.getDayIndex(this.selectedDay); // Get the index of the selected day
    if (this.dayIndex !== null) {
       
      this.desiredDayOfWeek = this.dayIndex; // Do something with the index
      const desiredDate = new Date();
       
      // Calculate the number of days to add to reach the next desired day of the week
      const daysToAdd = (this.desiredDayOfWeek - desiredDate.getDay() + 7) % 7;

      // Create a new date object for the earliest date that is the desired day of the week
      this.earliestDate = new Date(desiredDate.getFullYear(), desiredDate.getMonth(), desiredDate.getDate() + daysToAdd);
      this.convertDate = this.datePipe.transform(this.earliestDate, 'yyyy-MM-dd');
    } else {
      this.convertDate = ''
    }

     
    this.getBookDoctorList(this.convertDate)
  }


  ///////////////////////////////////////////////////
  //This function calculates intervals between a start date and an end date with a given duration. It splits the start date and end date into hours and minutes
  calculateIntervals() {
    
    // Set the start date
    const startDateParts = this.startDate.split(':');
    const startDate = new Date();
    startDate.setHours(Number(startDateParts[0]), Number(startDateParts[1]), 0, 0);


    // Set the end date
    const endDateParts = this.endDate.split(':');
    const endDate = new Date();
    endDate.setHours(Number(endDateParts[0]), Number(endDateParts[1]), 0, 0);

    this.intervals = [];

    for (let d = startDate; d <= endDate; d.setMinutes(d.getMinutes() + this.duration)) {
      if (d.getHours() > 12) {
        let hours = (d.getHours() - 12);
        const hour = hours.toString().padStart(2, '0');
        const minute = d.getMinutes().toString().padStart(2, '0');
        this.intervals.push(`${hour}:${minute}`);
      } else if (d.getHours() < 12) {
        const hour = d.getHours().toString().padStart(2, '0');
        const minute = d.getMinutes().toString().padStart(2, '0');
        this.intervals.push(`${hour}:${minute}`);
      } else {
        const hour = d.getHours().toString().padStart(2, '0');
        const minute = d.getMinutes().toString().padStart(2, '0');
        this.intervals.push(`${hour}:${minute}`);
      }

    }

     
  }

  /////////////////////////////////
  toggleActiveClass(index: any) {
    this.activeIndex = this.activeIndex === index ? null : index;
  }


  //////////////////////////////////////////////////////////////////
  //this function creates five FormControl objects, each with different validators
  initFormControl() {
    this.patientName = new FormControl('', [Validators.required, Validators.minLength(3)]),
      this.patientAge = new FormControl('', [Validators.required]),
      this.patientemail = new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z0-9]{2,}@[a-z]{3,10}\.(com|net|org)$/)]),
      this.phoneNumberPatient = new FormControl('', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]),
      this.time = new FormControl('', Validators.required)
  }
  //This function creates a new FormGroup object called patientAppointmentForm.
  createForm() {
    this.patientAppointmentForm = new FormGroup({
      patientName: this.patientName,
      patientemail: this.patientemail,
      phoneNumberPatient: this.phoneNumberPatient,
      patientAge: this.patientAge,
    }
    )
  }

  //This function is used to book a doctor appointment
  // this.bookSubscription = this._AppointmentsService.getBookDoctorList().subscribe({
  submit(select2Event:any) {
    if(this.patientAppointmentForm.status != 'INVALID' && select2Event.value != "") {
      const model: AppointmentsPatient = {
        patient_id: this.Patient_idNum,
        doctor_id: parseInt(this.singleDoctorId),
        price: parseInt(this.doctor.price),
        date: this.convertDate,
        time: this.selectedtime
      }
      this.isVisibleSpinner = true;
      this._AppointmentsService.createAppointmentPatient(model).subscribe((res:any) => {
         
         
        if(res.count === 1 ){
          this.toastr.success(!this.rtlDir?`Book Doctor Success!`:`تم حجز الطبيب بنجاح`)
          this.isVisibleSpinner = false;
          this.router.navigate(['/my-profile/appointments'])
        }else{
          this.toastr.error(!this.rtlDir?"You can't book doctor":"لا يمكنك حجز هذا الطبيب" , !this.rtlDir?"please choose another day":"برجاء اختيار يوم اخر");
          this.isVisibleSpinner = false;
        }
      })
      this._AuthService.AuthlayoutLeft.next(false);
      this._AuthService.istrigger.next(true);
    } else {
      this.toastr.error(!this.rtlDir?"Please Fill Appointment data":"برجاء ملء البيانات اولا");
      return
    }

  }

  // Method to handle time interval click event
  onTimeSelect(interval: string) {
    this.selectedtime = interval; // Update the selectedTime variable with the clicked interval
  }

  //This code is used to get a list of bookings for a particular doctor on a given date
  getBookDoctorList(convertDate:any) {
    
    const model: any = {
      doctor_id: parseInt(this.singleDoctorId),
      date: convertDate,
    }
     
    // passing in the model object as a parameter
    this.bookDaySubscription = this._AppointmentsService.getAllTimeBookeed(model).subscribe({
      //The response from this method is stored in the BookDayAppointment variable
      next: (BookDayAppointment) => {
         
        this.timeBookList=[]
        this.listOfDayBook = BookDayAppointment.data;
        this.filterintervals = this.intervals
        for(let x = 0  ; x < this.listOfDayBook.length; x++){
          const new_day =  this.listOfDayBook[x].date
          const edit_timeBook = this.listOfDayBook[x].time?.substring(0,5);
           
          if(new_day === convertDate && parseInt( this.singleDoctorId) === this.listOfDayBook[x].doctor.id){ 
            this.filterintervals = this.filterintervals.filter(time => time !== edit_timeBook)
            if(!this.timeBookList.includes(edit_timeBook)){
               
              this.timeBookList.push(edit_timeBook)
            }       
          }   
        }
         
         
      }
    })
  }

  runSelect(){
    $('.day-select2').select2({
      placeholder: !this.rtlDir?'Select a day':'اختر اليوم',
      dir:this.direction
    });

    $('.day-select2').change((event:any)=>{
       
      this.onDaySelect(event.target.value);
    })
  }

  showMoreReviews(){
    // Increment the display count
    this.displayCount += this.incrementCount;
     

    // Update the displayed reviews array
    this.displayedReviews = this.reviews.slice(0, this.displayCount);
  }
  showLessReviews(){
    // Increment the display count
    this.displayCount -= this.fixedDisplayCount;
    // Update the displayed reviews array
    this.displayedReviews = this.reviews.slice(0, this.displayCount);
     
  }

}
