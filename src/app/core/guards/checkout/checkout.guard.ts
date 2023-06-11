import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { DataService } from '../../services/data.service';
import { AuthService } from 'src/app/pages/Auth/services/auth.service';
import { CartService } from 'src/app/pages/cart/service/cart.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class CheckoutGuard implements CanActivate {

  constructor(private _DataService:DataService , private _AuthService:AuthService ,private router:Router , private _CartService:CartService, private toastr: ToastrService) { }
  // Direction Variables
  rtlDir:boolean = false;
  lang:string = "en";
  direction:string = "ltr";
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return new Observable<boolean>((observer) => {
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
                  this.toastr.error(`please add medicine to cart to do checkout`)
                  this.router.navigate(['/pharmacy'])
                  observer.next(false);
                  observer.complete();
                } else {
                  observer.next(true);
                  observer.complete(); 
                }
            }});
          }
        })    
      }) 
  }
  
}
