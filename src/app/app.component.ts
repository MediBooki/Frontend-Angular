import { Component, AfterViewInit, OnInit, Renderer2 } from '@angular/core';
import { DataService } from './core/services/data.service';
import * as $ from 'jquery';
import { AuthService } from './pages/Auth/services/auth.service';
import {  slider } from './pages/Auth/animation/route-animation';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import { Subscription, find } from 'rxjs';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [slider]
})
export class AppComponent implements OnInit {
  title = 'Frontend-Angular';
  login?: boolean;
  // loaded: boolean = false;
  layoutleft?: boolean
  allTenants: any[] = [];
  tenantsSubscription = new Subscription();

  constructor(private _DataService: DataService, private service: AuthService,private renderer: Renderer2,private router: Router) {

  }

  ngOnInit() {
    this.getAllTanant();
    this.setMainCountry();
    this.service.AuthlayoutLeft.subscribe(res => {
      this.layoutleft = res
    });
    this.service.isLogedIn.subscribe(res => {
      this.login = res
      console.log(this.login);
    });
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.addAnimateClasses();
      }
    });



    // this._DataService.isPageLoaded.subscribe((status) => {
    //   console.log('called with ' + status)
    //   this.loaded = status;
    //   if (status == false) {
    //     // document.body.classList.add('overflow-hidden');
    //     $('body').addClass('overflow-hidden');
    //     $('body').removeClass('overflow-auto');
    //   } else {
    //     $('body').removeClass('overflow-hidden');
    //     $('body').addClass('overflow-auto');
    //   }
    // })

  }

  addAnimateClasses() {
    const elements = document.querySelectorAll('.animate');
    elements.forEach((element) => {
      this.renderer.addClass(element, 'animate__animated');
      this.renderer.addClass(element, 'animate__fadeIn');
    });
  }

  getAllTanant() {
    this.tenantsSubscription =this._DataService.getAllTenants().subscribe({
      next:(tenants)=>{
        this.allTenants = tenants.data
        environment.tenants = tenants.data;
      }
    })
  }

  setMainCountry() {
    if(localStorage.getItem('tenant')==null){
      localStorage.setItem('tenant','http://medibookidashbord.test/api')
      environment.apimain='http://medibookidashbord.test/api'
    }else {
      environment.apimain = localStorage.getItem('tenant')!;
      // const currentCountry= localStorage.getItem('tenant')
      // let currentTenant = this.allTenants.find((tenant:any)=>tenant.name == currentCountry);
      //       if(currentTenant != null) {
      //         environment.apimain=`https//`+currentTenant.domain+`/api`
      //       }
    }
  }


}
