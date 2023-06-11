import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';
import { AuthService } from 'src/app/pages/Auth/services/auth.service';
import { CartService } from 'src/app/pages/cart/service/cart.service';
import { MedicinePurchased } from 'src/app/core/interfaces/medicine-purchased';
import { ToastrService } from 'ngx-toastr';
import { Roadmap } from 'src/app/core/interfaces/roadmap';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {


  /*=============================================( Variables )=============================================*/

  // Direction Variables
  rtlDir:boolean = false;
  lang:string = "en";
  direction:string = "ltr";

  // API Variables
  allMedicinesPurchased:MedicinePurchased[] = []

  // API Subscriptions Variables
  addCartSubscription = new Subscription();
  decreaseCartSubscription = new Subscription();
  removeCartSubscription = new Subscription();
  cartMedicinesSubscription = new Subscription();
  removeAllCartSubscription = new Subscription();

  // Other Variables
  totalPrice:number = 0;
  noDataError:any; // in case of error
  isVisibleSpinner:boolean = false;
  noData:boolean = false;
  defaultMedicineImg:string = this._DataService.defaultNoImg;

  // roadmap variable
  roadMapLinks:Roadmap = {
    roadMabFirstLink: {arabic:'الرئيسية',english:'Home',link:'/home'},
    roadMabLastLink: {arabic:'عربة الشراء',english:'Cart'},
    roadMabIntermediateLinks: [
      // {arabic:'دوا',english:'phar',link:'/home'}
    ]
  }
  /*=============================================( Initialization Methods )=============================================*/

  constructor(private _DataService:DataService , private _AuthService:AuthService , private _CartService:CartService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this._DataService.firstSectionHeight = this.firstSection?.nativeElement.offsetHeight;

    this.getPurchasedMedicines();
    this.listenTotalQty();
  }

  // when view load completely
  // ngAfterViewInit() {
  //   setTimeout(() => {
  //     Promise.resolve().then(()=>this._DataService.isPageLoaded.next(true))
  //   }, 0);
  // }


  /*=============================================( Component Created Methods )=============================================*/
  isVisibleAddRemoveSpinner:boolean = false;

  @ViewChild('firstSection') firstSection: ElementRef | undefined;
  @HostListener('window:scroll') // method triggered every scroll
  checkScroll() {
    this._DataService.firstSectionHeight = this.firstSection?.nativeElement.offsetHeight;
  }

  //----- Method 1
  // increase medicine amount
  increase(medicineId:number , medicineQty:number) {
    if(medicineQty<5) {
      this.selectedAddRemoveMedicine = medicineId;
      this.isVisibleAddRemoveSpinner = true;
      // this.isVisibleSpinner = true;
      this.addCartSubscription = this._CartService.addCart(medicineId).subscribe({
        next:(message)=>{
          console.log(message)
          this.getPurchasedMedicines(); // to update UI
          setTimeout(() => {
            this.toastr.success(!this.rtlDir?`Medicine's Quantity increased by one`:`تم زيادة كمية الدواء المضافة الى عربة الشراء`, !this.rtlDir?`Cart Result`:`ناتج عربة الشراء`)
            this.isVisibleAddRemoveSpinner = false;
            // this.isVisibleSpinner = false;
            this.selectedAddRemoveMedicine = 0;

          }, 700);
        },
        error:(error)=>{
          this.toastr.error(!this.rtlDir?`Too Many Requests please try again in a while`:`طلبات كثيرة جدًا ، يرجى المحاولة مرة أخرى بعد فترة`) 
          this.isVisibleAddRemoveSpinner = false;
          // this.isVisibleSpinner = false;

          this.selectedAddRemoveMedicine = 0;

        }
      })
    }
    
  }

  //----- Method 2
  // decrease medicine amount
  decrease(medicineId:number , medicineQty:number) {
    if(medicineQty>1) {
      this.selectedAddRemoveMedicine = medicineId;
      console.log(medicineQty)
      this.isVisibleAddRemoveSpinner = true;
      // this.isVisibleSpinner = true;
      this.decreaseCartSubscription = this._CartService.decreaseCart(medicineId).subscribe({
        next:(message)=>{
          console.log(message)
          this.getPurchasedMedicines(); // to update UI
          setTimeout(() => {
            this.toastr.success(!this.rtlDir?`Medicine's Quantity decreased by one`:`تم تقليل كمية الدواء المضافة الى عربة الشراء`, !this.rtlDir?`Cart Result`:`ناتج عربة الشراء`)
            this.isVisibleAddRemoveSpinner = false;
            // this.isVisibleSpinner = false;
            this.selectedAddRemoveMedicine = 0;

          }, 700);
        },
        error:(error)=>{
          this.toastr.error(!this.rtlDir?`Too Many Requests please try again in a while`:`طلبات كثيرة جدًا ، يرجى المحاولة مرة أخرى بعد فترة`) 
          this.isVisibleAddRemoveSpinner = false;
          this.selectedAddRemoveMedicine = 0;

          // this.isVisibleSpinner = false;
        }
      })
    }
    
    
  }

  isVisibleDeleteSpinner:boolean = false;
  selectedDeleteMedicine:number = 0;
  selectedAddRemoveMedicine:number = 0;


  //----- Method 3
  // decrease medicine amount
  removeCart(medicineId:number) {
      // this.isVisibleSpinner = true;
      this.selectedDeleteMedicine = medicineId;
      this.isVisibleDeleteSpinner = true;
      this.removeCartSubscription = this._CartService.removeCart(medicineId).subscribe({
        next:(message)=>{
          console.log(message)
          this.getPurchasedMedicines(); // to update UI
          setTimeout(() => {
            this.toastr.info(!this.rtlDir?`Medicine was removed from cart`:`تم حذف الدواء من عربة الشراء`, !this.rtlDir?`Cart Result`:`ناتج عربة الشراء`)
            // this.isVisibleSpinner = false;
            this.isVisibleDeleteSpinner = false;
            this.selectedDeleteMedicine = 0;
          }, 700);
        },
        error:(error)=>{
          this.toastr.error(!this.rtlDir?`Too Many Requests please try again in a while`:`طلبات كثيرة جدًا ، يرجى المحاولة مرة أخرى بعد فترة`) 
          // this.isVisibleSpinner = false;
            this.isVisibleDeleteSpinner = false;
            this.selectedDeleteMedicine = 0;
        }
      })
    
    
    
  }

  //----- Method 4
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
            console.log(purchasedMedicines)
            // console.log(typeof(purchasedMedicines.data))
            if(typeof(purchasedMedicines.data)=='string' || (typeof(purchasedMedicines.data)=='object' && purchasedMedicines.data.length==0) || purchasedMedicines.data.user_cart_items.length == 0) {
              this.noData = true;
            } else {
              this.allMedicinesPurchased = purchasedMedicines.data.user_cart_items;
              this._CartService.setcartData(this.allMedicinesPurchased)
              console.log(purchasedMedicines.data.user_cart_items);
              this.totalPrice = 0;
              purchasedMedicines.data.user_cart_items.forEach((element:any) => {
                this.totalPrice += (element.qty * element.price)
              });
            }
          // this.isVisibleSpinner = false;
        },
      error:(error)=>{
        console.log(error);
        if(error.error.message == 'Too Many Attempts.') {
          this.toastr.error(!this.rtlDir?`Too Many Requests please try again in a while`:`طلبات كثيرة جدًا ، يرجى المحاولة مرة أخرى بعد فترة`) 
        } else {
          this.noData = true;
        }
        // this.noDataError = error;
        // this.isVisibleSpinner = false;
      }});
      }
    })
    this._CartService.calculateTotalQty();
  }

  listenTotalQty() {
    if (localStorage.getItem("token") != null) {
      this._CartService.medicinesQty.subscribe((qty) => { // to calculate quantity each time it changes
        // this.isVisibleSpinner = true
        this.cartMedicinesSubscription = this._CartService.getAllPurchasedMedicines(this.lang).subscribe({
          next: (medicinesPurchased) => { // to calculate quantity for first time (when refreshing)
            if(typeof(medicinesPurchased.data)=='string' || (typeof(medicinesPurchased.data)=='object' && medicinesPurchased.data.length==0) || medicinesPurchased.data.user_cart_items.length == 0) {
              this.noData = true;
            } else {
              this.allMedicinesPurchased = medicinesPurchased.data.user_cart_items
            }
            // this.isVisibleSpinner = false;
          },
          error: (error) => {
            console.log(error)
            // this.isVisibleSpinner = false;
          }
        });
      });
    }
  }

  // to remove all medicines from cart
  deleteAllCart() {
    if(!this.isVisibleAddRemoveSpinner) {
      this.isVisibleSpinner = true;
      this.removeAllCartSubscription = this._CartService.deleteAllCart().subscribe({
        next:(message)=>{
          console.log(message)
          this.getPurchasedMedicines(); // to update UI
          setTimeout(() => {
            this.toastr.info(!this.rtlDir?`All Medicines were removed from cart`:`تم حذف جميع الأدوية من عربة الشراء`, !this.rtlDir?`Cart Result`:`ناتج عربة الشراء`)
            this.isVisibleSpinner = false;
          }, 700);
        },
        error:(error)=>{
          this.toastr.error(!this.rtlDir?`Error has occured`:`حدث خطأ ما`) 
          this.isVisibleSpinner = false;
        }
      })
    }
  }

  
  /*=============================================( Destroying Method )=============================================*/

  ngOnDestroy() {
    this.addCartSubscription.unsubscribe();
    this.decreaseCartSubscription.unsubscribe();
    this.removeCartSubscription.unsubscribe();
    this.cartMedicinesSubscription.unsubscribe();
    this.removeAllCartSubscription.unsubscribe();
  }
}
