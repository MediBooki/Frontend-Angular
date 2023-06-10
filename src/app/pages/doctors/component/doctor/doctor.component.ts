import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Doctor } from 'src/app/core/interfaces/doctor';
import { AuthService } from 'src/app/pages/Auth/services/auth.service';
import { DataService } from 'src/app/core/services/data.service';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.scss']
})
export class DoctorComponent implements OnInit, OnChanges {

  // Variables
  rtlDir:boolean = false;
  @Input() doctor: Doctor;
  overallRating:number = 0
  defaultDoctorImg:string = this._DataService.defaultNoImg;

  constructor(private _AuthService: AuthService, private _DataService: DataService) {
    this.doctor = {
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
      reviews:[{
        id:0,
        comment:"",
        rating:0
      }],
      education: '',
      experience: ''
    };
  }

  ngOnInit(): void {
    Promise.resolve().then(() => this._AuthService.isLogedIn.next(true));
    this.getLang();
  }


  getLang() {
    this._DataService._lang.subscribe({
      next:(lang)=>{
        if(lang == 'en')
        {
          this.rtlDir = false;
        } else {
          this.rtlDir = true;
        }
      }
    })

  }
  ngOnChanges(): void {
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
  }
}
