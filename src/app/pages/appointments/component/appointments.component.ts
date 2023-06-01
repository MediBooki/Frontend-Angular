import { Time } from 'src/app/core/interfaces/time';
import { Doctor } from './../../../core/interfaces/doctor';
import { Component, OnInit } from '@angular/core';
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
import { type } from 'jquery';



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
  
  isVisibleSpinner: boolean = false;
  overallRating:number = 0


  
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

  constructor(private _AuthService: AuthService, private _DataService: DataService, private _AppointmentsService: AppointmentsService, private route: ActivatedRoute, private fb: FormBuilder, private router: Router, private datePipe: DatePipe, private toastr: ToastrService) {
    this.singleDoctorId = this.route.snapshot.paramMap.get('id');
    console.log(this.singleDoctorId);
    this.getDoctorById();
    console.log(this.convertDate);

  }

  ngOnInit(): void {
    // Promise.resolve().then(() => this._DataService.isPageLoaded.next(false));
    // Promise.resolve().then(() => this._AuthService.isLogedIn.next(true));
    this.getLang();
    this.getBookDoctorList(this.convertDate)
    this.getDoctorById();
    this.initFormControl();
    this.createForm();
    this.runSelect()

  }


  // when view load completely
  // ngAfterViewInit() {
  //   setTimeout(() => {
  //     Promise.resolve().then(() => this._DataService.isPageLoaded.next(true))
  //   }, 0);
  // }

  
  /*=============================================( Component Created Methods )=============================================*/


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
              console.log(Doctor)

              this.doctor = Doctor.data;
              this.startDate = this.doctor.start;
              this.endDate = this.doctor.end;
              this.duration = this.doctor.patient_time_minute;

                let sum = 0;
                // let avg = 0;
                this.doctor.reviews.forEach((doctorReview)=>{
                  // console.log(doctorReview)
                  sum = sum + doctorReview.rating
                })
                this.overallRating = sum / this.doctor.reviews.length;
            
                
                // console.log(Math.floor((avg%1.0)*100))
                // if(Math.floor((avg%1.0)*100) >= 25 && Math.floor((avg%1.0)*100) < 75) {
                //   this.overallRating = Math.floor(avg) + 0.5
                // } else if (Math.floor((avg%1.0)*100) >= 75) {
                //   console.log(Math.ceil(avg))
                //   this.overallRating = Math.ceil(avg)
                // } else {
                //   this.overallRating = Math.floor(avg)
                // }
              

              this.calculateIntervals();
              // this.isVisibleSpinner = false;
            },
            error: (error) => {
              this.noDataError = error;
              // this.isVisibleSpinner = false;
            }
          });
        }
      })
    }


    //This function that takes in a day as an argument and returns the index of that day in the week
    getDayIndex(day: any) {
      if (typeof day === 'string' && day !== 'null') {
        const dayName = day.toLowerCase();
        console.log(dayName)
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
    console.log(this.selectedDay)
    this.dayIndex = this.getDayIndex(this.selectedDay); // Get the index of the selected day
    if (this.dayIndex !== null) {
      console.log(this.dayIndex)
      this.desiredDayOfWeek = this.dayIndex; // Do something with the index
      const desiredDate = new Date();
      console.log(desiredDate)
      // Calculate the number of days to add to reach the next desired day of the week
      const daysToAdd = (this.desiredDayOfWeek - desiredDate.getDay() + 7) % 7;

      // Create a new date object for the earliest date that is the desired day of the week
      this.earliestDate = new Date(desiredDate.getFullYear(), desiredDate.getMonth(), desiredDate.getDate() + daysToAdd);
      this.convertDate = this.datePipe.transform(this.earliestDate, 'yyyy-MM-dd');
    } else {
      this.convertDate = ''
    }

    console.log(this.convertDate);
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

    console.log(this.intervals)
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
  submit() {
    const model: AppointmentsPatient = {
      patient_id: this.Patient_idNum,
      doctor_id: parseInt(this.singleDoctorId),
      price: parseInt(this.doctor.price),
      date: this.convertDate,
      time: this.selectedtime
    }
    this.isVisibleSpinner = true;
    this._AppointmentsService.createAppointmentPatient(model).subscribe((res:any) => {
      console.log(model);
      console.log(res.count);
      if(res.count === 1 ){
        this.toastr.success(!this.rtlDir?`Book Doctor Success!`:`تم حجز الطبيب بنجاح`)
        this.isVisibleSpinner = false;
        this._DataService.curruntService.next("appointments")
        this.router.navigate(['/my-profile'])
      }else{
        this.toastr.error("You can't book doctor" , "please choose another day");
        this.isVisibleSpinner = false;
      }
    })
    this._AuthService.AuthlayoutLeft.next(false);
    this._AuthService.istrigger.next(true);

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
    console.log(model)
    // passing in the model object as a parameter
    this.bookDaySubscription = this._AppointmentsService.getAllTimeBookeed(model).subscribe({
      //The response from this method is stored in the BookDayAppointment variable
      next: (BookDayAppointment) => {
        console.log(BookDayAppointment)
        this.timeBookList=[]
        this.listOfDayBook = BookDayAppointment.data;
        this.filterintervals = this.intervals
        for(let x = 0  ; x < this.listOfDayBook.length; x++){
          const new_day =  this.listOfDayBook[x].date
          const edit_timeBook = this.listOfDayBook[x].time?.substring(0,5);
          console.log(edit_timeBook)
          if(new_day === convertDate && parseInt( this.singleDoctorId) === this.listOfDayBook[x].doctor.id){ 
            this.filterintervals = this.filterintervals.filter(time => time !== edit_timeBook)
            if(!this.timeBookList.includes(edit_timeBook)){
              console.log(!this.timeBookList.includes(edit_timeBook))
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
      console.log(event.target.value)
      this.onDaySelect(event.target.value);
    })
  }

}
