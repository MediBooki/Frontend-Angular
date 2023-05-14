import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivateChild {
  
  constructor(private router:Router,private toastr: ToastrService){}
  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if('token' in localStorage){
      return true;
    }else{
      if(localStorage.getItem('lang') != null){
        if (localStorage.getItem('lang') == 'en') {
          this.toastr.error(`please login first`)
        } else {
          this.toastr.error(`برجاء تسجيل علي موقع اولا`)
        }
      }else{
        this.toastr.error(`please login first`)
      }
      this.router.navigate(['/Login'])
      return false
    }
  }
  canActivate(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if('token' in localStorage){
        return true;
      }else{
        if(localStorage.getItem('lang') != null){
          if (localStorage.getItem('lang') == 'en') {
            this.toastr.error(`please login first`)
          } else {
            this.toastr.error(`برجاء تسجيل علي موقع اولا`)
          }
        }else{
          this.toastr.error(`please login first`)
        }
        this.router.navigate(['/Login'])
        return false
      }
  }

  
  
}


