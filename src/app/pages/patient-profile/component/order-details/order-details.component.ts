import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/core/services/data.service';
import { AuthService } from 'src/app/pages/Auth/services/auth.service';
import { PatientProfileService } from '../../service/patient-profile.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit, OnDestroy {

  constructor(private _AuthService: AuthService, private _DataService: DataService,private _activatedRouting: ActivatedRoute,private _PatientProfileService : PatientProfileService) { }

  ngOnInit(): void {
    Promise.resolve().then(() => this._AuthService.isLogedIn.next(true));
    Promise.resolve().then(() => this._DataService.isPageLoaded.next(false));
    this.getLang();
    this.orderId = this._activatedRouting.snapshot.params['id'];
    this.getOrderData(this.orderId);
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
  orderId: any;
  defaultImg:string = this._DataService.defaultNoImg;

  // api vars
  orderDetails!:any;
  oneOrderAPIres:any;

  // API Subscriptions Variables
  oneOrderSubscription = new Subscription();

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
  getOrderData(id:number){
    this._DataService._lang.subscribe({next:(language)=>{
      // to get all diagnosis
        this.oneOrderSubscription = this._PatientProfileService.getOrderDetails(id,language).subscribe({
        next: (order) => {
          this.orderDetails = order.data;
          this.oneOrderAPIres = order;
           
        },
        error: (error) => {
          this.oneOrderAPIres = error;
           
        }
        });
      }});
  }

    
  /*=============================================( Destroying Method )=============================================*/

  ngOnDestroy() {
    this.oneOrderSubscription.unsubscribe();
  }

}
