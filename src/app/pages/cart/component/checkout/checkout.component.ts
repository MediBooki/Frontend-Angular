import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CartService } from 'src/app/pages/cart/service/cart.service';
import { DataService } from 'src/app/core/services/data.service';
import { AuthService } from 'src/app/pages/Auth/services/auth.service';
import { MedicinePurchased } from 'src/app/core/interfaces/medicine-purchased';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  /*=============================================( Variables )=============================================*/

  // Direction Variables
  rtlDir:boolean = false;
  lang:string = "en";
  direction:string = "ltr";

  // API Variables
  allMedicinesPurchased:MedicinePurchased[] = []
  
  // Other Variables
  totalPrice:number = 0;
  noDataError:any; // in case of error
  isVisibleSpinner:boolean = true;
  noData:boolean = false;
  invalidForm:boolean = false

  // Filter and Search Form Variables
  checkoutForm : FormGroup;

  
  /*=============================================( Initialization Methods )=============================================*/

  constructor(private _DataService:DataService , private _AuthService:AuthService , private _CartService:CartService, private toastr: ToastrService, private _FormBuilder:FormBuilder, private router: Router) {
    
    this.checkoutForm = this._FormBuilder.group({
      first_name: ['' , [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      last_name: ['' , [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      email: ['' , [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9]{2,}@[a-z]{2,}\.[a-zA-Z]{2,}$/)]],
      phone1: ['' , [Validators.required, Validators.pattern(/^\+?(002)?[\d\s()-]{4,}$/)]], // may contains + or 002 or maynot
      phone2: ['' , Validators.pattern(/^\+?(002)?[\d\s()-]{4,}$/)],
      address1: ['' , Validators.required],
      address2: [''],
      city: ['' , [Validators.required, Validators.pattern(/^[a-zA-Z\s]{2,}$/)]],
      zip_code: ['' , [Validators.required, Validators.pattern(/^\d{3,}$/)]],
      state: ['' , [Validators.required, Validators.pattern(/^[a-zA-Z\s]{2,}$/)]],
      total: [''],
    })

  }

  ngOnInit(): void {
    // Promise.resolve().then(()=>this._DataService.isPageLoaded.next(false));
    // Promise.resolve().then(() => this._AuthService.isLogedIn.next(true));
    this.getPurchasedMedicines();
    console.log(this._CartService.getTotalQty())

  }


    // // when view load completely
    // ngAfterViewInit() {
    //   setTimeout(() => {
    //     Promise.resolve().then(()=>this._DataService.isPageLoaded.next(true))
    //   }, 0);
    // }



  /*=============================================( Component Created Methods )=============================================*/

  getPurchasedMedicines() {
    this._DataService._lang.subscribe({
      next:(lang)=>{
        this.lang = lang;
        if (lang == 'en') {
          this.rtlDir = false;
          this.direction = 'ltr';
        } else {
          this.rtlDir = true;
          this.direction = 'rtl';
        }

        this._CartService.getAllPurchasedMedicines(lang).subscribe({
          next:(purchasedMedicines)=>{
            if(typeof(purchasedMedicines.data)=='string' || (typeof(purchasedMedicines.data)=='object' && purchasedMedicines.data.length==0) || purchasedMedicines.data.user_cart_items.length == 0) {
              this.noData = true;
            } else {
              this.allMedicinesPurchased = purchasedMedicines.data.user_cart_items;
              console.log(purchasedMedicines.data.user_cart_items);
              this.totalPrice = 0;
              purchasedMedicines.data.user_cart_items.forEach((element:any) => {
                this.totalPrice += (element.qty * element.price)
              });
            }
          this.isVisibleSpinner = false;
        },
      error:(error)=>{
        // console.log(error);
        // this.noDataError = error;
      }});
      }
    })
    // this._CartService.calculateTotalQty();
  }
  

  submitCheckout() {
    if(this.checkoutForm.status == 'INVALID') {
      this.invalidForm = true
      this.toastr.info(!this.rtlDir?`Please Fill the Required Inputs First`:`برجاء اكمال الحقول المطلوبة أولا`, !this.rtlDir?`Checkout Result`:`ناتج عملية الشراء`)
    } else {
      // if(this.paymentMethod == 'cash') {
        this.invalidForm = false
        this.checkoutForm.controls["total"].setValue(this.totalPrice)
        console.log(this.checkoutForm)
        this._CartService.checkoutDetails(this.checkoutForm.value).subscribe({
          next:(res)=>{
            console.log(res)
            this._CartService.medicinesQty.next(0);
            if(this.paymentMethod == 'cash') {
              this._CartService.paymentOrder(2).subscribe({
                next:(res)=>{
                  this.toastr.success(!this.rtlDir?`Your Order has been Submitted Successfully`:`تم تسجيل طلبك بنجاح`, !this.rtlDir?`Checkout Result`:`ناتج عملية الشراء`);
                  console.log(res)
                },
                error:(error)=>{
                  console.log(error)
                }
              })
              this._DataService.curruntService.next("orders")
              this.router.navigate(['/my-profile'])
            } else if(this.paymentMethod == 'online') {
              this.isVisibleSpinner = true
              this.toastr.success(!this.rtlDir?`You will be redirected to paymob to complete your online payment`:`سيتم توجيهك الى صفحة paymob لاكمال عملية الدفع الالكترونية`, !this.rtlDir?`Checkout Result`:`ناتج عملية الشراء`);
              this._CartService.paymentOrder(1).subscribe({
                next:(res)=>{
                  // this._DataService.curruntService.next('orders')
                  this.isVisibleSpinner = false;
                  localStorage.setItem("currentPaymentId" , JSON.stringify(res.details.payment_id))
                  window.location.href = `${res.details.redirect_url}`;
                  console.log(res)

                },
                error:(error)=>{
                  console.log(error)
                }
              })
            }
          },
          error:(error)=>{
            console.log(error)
          }
        })
      // }
    }

  }


  paymentMethod:string = 'cash'
  changePaymentMethod(paymentMethod:any) {
    this.paymentMethod = paymentMethod;
  }


}



