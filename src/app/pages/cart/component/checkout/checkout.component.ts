import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CartService } from 'src/app/pages/cart/service/cart.service';
import { DataService } from 'src/app/core/services/data.service';
import { AuthService } from 'src/app/pages/Auth/services/auth.service';
import { MedicinePurchased } from 'src/app/core/interfaces/medicine-purchased';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Roadmap } from 'src/app/core/interfaces/roadmap';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy {

  /*=============================================( Variables )=============================================*/

  // Direction Variables
  rtlDir:boolean = false;
  lang:string = "en";
  direction:string = "ltr";

  // API Variables
  allMedicinesPurchased:MedicinePurchased[] = []
  
  // API Subscriptions Variables
  cartMedicinesSubscription = new Subscription();
  checkoutSubscription = new Subscription();
  paymentMethodSubscription = new Subscription();

  // Other Variables
  totalPrice:number = 0;
  totalPriceDiscount:number = 0;
  insurance_id:any = '';
  noDataError:any; // in case of error
  isVisibleSpinner:boolean = false;
  noData:boolean = false;
  invalidForm:boolean = false

  // Filter and Search Form Variables
  checkoutForm : FormGroup;

  // roadmap variable
  roadMapLinks:Roadmap = {
    roadMabFirstLink: {arabic:'الرئيسية',english:'Home',link:'/home'},
    roadMabLastLink: {arabic:'اتمام عملية الشراء',english:'Checkout'},
    roadMabIntermediateLinks: [
      {arabic:'عربة الشراء',english:'Cart',link:'/cart'}
      // {arabic:'دوا',english:'phar',link:'/home'}
    ]
  }
  
  /*=============================================( Initialization Methods )=============================================*/

  constructor(private _DataService:DataService , private _AuthService:AuthService , private _CartService:CartService, private toastr: ToastrService, private _FormBuilder:FormBuilder, private router: Router) {
    
    this.checkoutForm = this._FormBuilder.group({
      first_name: ['' , [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      last_name: ['' , [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      email: ['' , [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9]{1,}.*[a-zA-Z0-9]{1,}@[a-z]{2,}\.[a-zA-Z]{2,}$/)]],
      phone1: ['' , [Validators.required, Validators.pattern(/^\+?(002)?[\d\s()-]{4,}$/)]], // may contains + or 002 or maynot
      phone2: ['' , Validators.pattern(/^\+?(002)?[\d\s()-]{4,}$/)],
      address1: ['' , Validators.required],
      address2: [''],
      city: ['' , [Validators.required, Validators.pattern(/^[a-zA-Z\s]{2,}$/)]],
      zip_code: ['' , [Validators.required, Validators.pattern(/^\d{3,}$/)]],
      state: ['' , [Validators.required, Validators.pattern(/^[a-zA-Z\s]{2,}$/)]],
      total: [''],
      total_after_discount: [''],
      insurance_id: ['']
    })

  }

  ngOnInit(): void {
    this._DataService.firstSectionHeight = this.firstSection?.nativeElement.offsetHeight;
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

  //----- Method 1
  @ViewChild('firstSection') firstSection: ElementRef | undefined;
  @HostListener('window:scroll') // method triggered every scroll
  checkScroll() {
    this._DataService.firstSectionHeight = this.firstSection?.nativeElement.offsetHeight;
  }

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
        this.cartMedicinesSubscription = this._CartService.getAllPurchasedMedicines(lang).subscribe({
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

              if(localStorage.getItem("insuranceDiscount") != null) {
                this.totalPriceDiscount = this.totalPrice - (this.totalPrice * (JSON.parse(localStorage.getItem('insuranceDiscount')!)/100));
              }

              if(localStorage.getItem("insuranceID") != null) {
                this.insurance_id = JSON.parse(localStorage.getItem('insuranceID')!);
              }
            }
          }
        });
      }
    })
  }
  

  submitCheckout() {
    if(this.checkoutForm.status == 'INVALID') {
      this.invalidForm = true
      this.toastr.info(!this.rtlDir?`Please Fill the Required Inputs First`:`برجاء اكمال الحقول المطلوبة أولا`, !this.rtlDir?`Checkout Result`:`ناتج عملية الشراء`)
    } else {
      // if(this.paymentMethod == 'cash') {
        this.invalidForm = false
        this.checkoutForm.controls["total"].setValue(this.totalPrice)
        if(localStorage.getItem("insuranceDiscount") != null) {
          this.checkoutForm.controls["total_after_discount"].setValue(this.totalPriceDiscount)
        }
        if(localStorage.getItem("insuranceID") != null) {
          this.checkoutForm.controls["insurance_id"].setValue(JSON.parse(localStorage.getItem('insuranceID')!))
        }
        console.log(this.checkoutForm)
        this.checkoutSubscription = this._CartService.checkoutDetails(this.checkoutForm.value).subscribe({
          next:(res)=>{
            console.log(res)
            this._CartService.medicinesQty.next(0);
            if(this.paymentMethod == 'cash') {
              this.paymentMethodSubscription = this._CartService.paymentOrder(2).subscribe({
                next:(res)=>{
                  this.toastr.success(!this.rtlDir?`Your Order has been Submitted Successfully`:`تم تسجيل طلبك بنجاح`, !this.rtlDir?`Checkout Result`:`ناتج عملية الشراء`);
                  console.log(res)
                },
                error:(error)=>{
                  console.log(error)
                }
              })
              this.router.navigate(['/my-profile/orders'])
            } else if(this.paymentMethod == 'online') {
              this.isVisibleSpinner = true
              this.toastr.success(!this.rtlDir?`You will be redirected to paymob to complete your online payment`:`سيتم توجيهك الى صفحة paymob لاكمال عملية الدفع الالكترونية`, !this.rtlDir?`Checkout Result`:`ناتج عملية الشراء`);
              this.paymentMethodSubscription = this._CartService.paymentOrder(1).subscribe({
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


  /*=============================================( Destroying Method )=============================================*/

  ngOnDestroy() {
    this.cartMedicinesSubscription.unsubscribe();
    this.checkoutSubscription.unsubscribe();
    this.paymentMethodSubscription.unsubscribe();
  }

}



