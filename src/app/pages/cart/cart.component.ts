import { Component, OnInit } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { AuthService } from '../Auth/services/auth.service';
import { CartService } from '../../core/services/cart/cart.service';
import { MedicinePurchased } from '../../core/interfaces/medicine-purchased'
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {


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
  defaultMedicineImg:string = this._DataService.defaultNoImg;

  /*=============================================( Initialization Methods )=============================================*/

  constructor(private _DataService:DataService , private _AuthService:AuthService , private _CartService:CartService, private toastr: ToastrService) { }

  ngOnInit(): void {
    Promise.resolve().then(()=>this._DataService.isPageLoaded.next(false));
    Promise.resolve().then(() => this._AuthService.isLogedIn.next(true));
    this.getPurchasedMedicines();
  }

  // when view load completely
  ngAfterViewInit() {
    setTimeout(() => {
      Promise.resolve().then(()=>this._DataService.isPageLoaded.next(true))
    }, 0);
  }


  /*=============================================( Component Created Methods )=============================================*/

  //----- Method 1
  // increase medicine amount
  increase(medicineId:number) {
    this.isVisibleSpinner = true;
    this._CartService.addCart(medicineId).subscribe({
      next:(message)=>{
        console.log(message)
        this.getPurchasedMedicines(); // to update UI
        setTimeout(() => {
          this.toastr.success(!this.rtlDir?`Medicine's Quantity increased by one`:`تم زيادة كمية الدواء المضافة الى عربة الشراء`, !this.rtlDir?`Cart Result`:`ناتج عربة الشراء`)
          this.isVisibleSpinner = false;
        }, 700);
      },
      error:(error)=>{
        this.toastr.error(this.rtlDir?`An Error has occured`:`حدث خطأ ما` , `${error}`)
      }
    })
    
  }

  //----- Method 2
  // decrease medicine amount
  decrease(medicineId:number) {
    this.isVisibleSpinner = true;
    this._CartService.decreaseCart(medicineId).subscribe({
      next:(message)=>{
        console.log(message)
        this.getPurchasedMedicines(); // to update UI
        setTimeout(() => {
          this.toastr.success(!this.rtlDir?`Medicine's Quantity decreased by one`:`تم تقليل كمية الدواء المضافة الى عربة الشراء`, !this.rtlDir?`Cart Result`:`ناتج عربة الشراء`)
          this.isVisibleSpinner = false;
        }, 700);
      },
      error:(error)=>{
        this.toastr.error(this.rtlDir?`An Error has occured`:`حدث خطأ ما` , `${error}`)
      }
  })
    
  }

  //----- Method 3
  // decrease medicine amount
  removeCart(medicineId:number) {
    this.isVisibleSpinner = true;
    this._CartService.removeCart(medicineId).subscribe({
      next:(message)=>{
        console.log(message)
        this.getPurchasedMedicines(); // to update UI
        setTimeout(() => {
          this.toastr.info(!this.rtlDir?`Medicine was removed from cart`:`تم حذف الدواء من عربة الشراء`, !this.rtlDir?`Cart Result`:`ناتج عربة الشراء`)
          this.isVisibleSpinner = false;
        }, 700);
      },
      error:(error)=>{
        this.toastr.error(this.rtlDir?`An Error has occured`:`حدث خطأ ما` , `${error}`)
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

        this._CartService.getAllPurchasedMedicines(lang).subscribe({
          next:(purchasedMedicines)=>{
            console.log(purchasedMedicines)
            // console.log(typeof(purchasedMedicines.data))
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
        console.log(error);
        this.noData = true;
        // this.noDataError = error;
        this.isVisibleSpinner = false;
      }});
      }
    })
    this._CartService.calculateTotalQty();
  }

}
