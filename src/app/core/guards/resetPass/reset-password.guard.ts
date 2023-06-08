import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordGuard implements CanActivate {
  constructor(private router: Router,private toastr: ToastrService){}
  private allowAccess: boolean = false;
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if ('reset_token' in localStorage && 'email_patient' in localStorage) {
        return true; // Allow access to the page
      } else {
        if(localStorage.getItem('lang') != null){
          if (localStorage.getItem('lang') == 'en') {
            this.toastr.error(`please enter your email first`)
          } else {
            this.toastr.error(`برجاء ادخال ايميلك اولا`)
          }
        }else{
          this.toastr.error(`please enter your email first`)
        }
        this.router.navigate(['/forgetPassword']); // Redirect to a forgetPassword page
        return false;
      }
  }
  
}
