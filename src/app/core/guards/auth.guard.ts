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

@Injectable({
  providedIn: 'root'
})
export class unAuthGuard implements CanActivateChild {
  
  constructor(private router:Router,private toastr: ToastrService){}
  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if('token' in localStorage){
      if(localStorage.getItem('lang') != null){
        if (localStorage.getItem('lang') == 'en') {
          this.toastr.error(`You are already logged in to the site`)
        } else {
          this.toastr.error(`لقد قمت بتسجيل الدخول بالفعل في الموقع`)
        }
      }else{
        this.toastr.error(`You are already logged in to the site`)
      }
      this.router.navigate(['/home'])
      return false;
    }else{
      return true
    }
  }
  canActivate(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if('token' in localStorage){
        if(localStorage.getItem('lang') != null){
          if (localStorage.getItem('lang') == 'en') {
            this.toastr.error(`You are already logged in to the site`)
          } else {
            this.toastr.error(`لقد قمت بتسجيل الدخول بالفعل في الموقع`)
          }
        }else{
          this.toastr.error(`You are already logged in to the site`)
        }
        this.router.navigate(['/home'])
        return false;
      }else{
        return true
      }
    }

  
  
}



