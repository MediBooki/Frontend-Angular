import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/core/services/data.service';
import { PatientProfileService } from '../../service/patient-profile.service';
import { Subscription } from 'rxjs';
import { CartService } from 'src/app/pages/cart/service/cart.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit, OnDestroy {
  // constructor & dependency injection
  constructor(private _DataService:DataService, private _PatientProfileService:PatientProfileService, private toastr: ToastrService ,  private router: Router,private _cartservice : CartService,private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.savePaymentOnline(); // to save payment details incase he place order and paid online
    this.getLang();
    this.getOrders();
  }
/*--------------------------------------------------------------(variables)------------------------------- */

  lang:string = "en";
  rtlDir:boolean = false;
  direction:string = 'ltr';

  orders:any[]=[];
  ordersAPIres:any;
  allOrders_notempty?:boolean=true;

  // API Subscriptions Variables
  ordersSubscription = new Subscription();
  savePaymentSubscription = new Subscription();

/*--------------------------------------------------------------(methods)--------------------------------- */

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
  getOrders(){
    // to get all orders
    this.ordersSubscription = this._PatientProfileService.getOrders().subscribe({
      next: (orders) => {
        this.orders = orders.data;
        this.ordersAPIres = orders;
        this.allOrders_notempty = this.orders.length > 0;
         
      },
      error: (error) => {
        this.ordersAPIres = error;
        this.allOrders_notempty = false;
         
      }
    });
  }


  savePaymentOnline() {
     
    this.route.queryParams.subscribe(params => {
      // Access the "pending" parameter here
      const isPending = params['order'];
       
      if(localStorage.getItem('currentPaymentId') != null) {
       

       
        // if(isPending!=null && isPending == JSON.parse(localStorage.getItem('currentPaymentId')!) && params['success']=='true') {
        if(JSON.parse(localStorage.getItem('currentPaymentId')!) != null) {
         

          let model = {
            "amount_cents" : params['amount_cents'],
            "success" : params['success'],
            "order" : params['order'],
            "created_at" : params['created_at'],
            "currency" : params['currency'],
            "updated_at" : params['updated_at'],
            "source_data" : params['source_data.type'],
            "source_subdata" : params['source_data.sub_type']
          }
          this.savePaymentSubscription = this._cartservice.savePaymentOnline(model).subscribe({
            next:(res)=>{
               
              localStorage.removeItem('currentPaymentId');
              this._cartservice.medicinesQty.next(0)
              this.toastr.success(!this.rtlDir?`Your Order has been Submitted Successfully`:`تم تسجيل طلبك بنجاح`, !this.rtlDir?`Checkout Result`:`ناتج عملية الشراء`);
              this.getOrders();
            }, error:()=>{
              this.toastr.error(this.rtlDir?`An Error has occured`:`حدث خطأ ما`)
            }
          })
          // this._DataService.curruntService.next('orders')
          // this.curruntService = 'orders';
           

           
          // call API to save patient information
        }
      }

    });
  }

    
  /*=============================================( Destroying Method )=============================================*/

  ngOnDestroy() {
    this.ordersSubscription.unsubscribe();
    this.savePaymentSubscription.unsubscribe();
  }

}
