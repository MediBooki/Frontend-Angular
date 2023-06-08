import { DataService } from 'src/app/core/services/data.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/pages/Auth/services/auth.service';
import { ReviewService } from 'src/app/pages/review/service/review.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
import { Subscription } from 'rxjs';
import { Medicine } from 'src/app/core/interfaces/medicine';
import { CartService } from 'src/app/pages/cart/service/cart.service';
import { PatientProfileService } from '../../service/patient-profile.service';
import { AppointmentsService } from 'src/app/pages/appointments/service/appointments.service';
import { reviews } from 'src/app/core/interfaces/patients';

@Component({
  selector: 'app-patient-profile',
  templateUrl: './patient-profile.component.html',
  styleUrls: ['./patient-profile.component.scss']
})
export class PatientProfileComponent implements OnInit, OnDestroy {
  // constructor & dependency injection
  constructor(private _AuthService: AuthService,private _AppointmentsService:AppointmentsService ,private _ReviewService:ReviewService, private _DataService:DataService, private _PatientProfileService:PatientProfileService, private toastr: ToastrService ,  protected router: Router,private route: ActivatedRoute,private _cartservice : CartService) { }

  // on init
  ngOnInit(): void {
    this.getLang();
  }

  /*=============================================( Variables )=============================================*/
  lang:string = "en";
  rtlDir:boolean = false;
  direction:string = 'ltr';
  is_login: boolean= false;
  islogsub = this._DataService.is_login.subscribe(res => {
      this.is_login = res
    });

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
    console.log(this.router.url.includes('details'))
  }

  ngOnDestroy(){

  }


}



