import { Component, AfterViewInit, OnInit } from '@angular/core';
import { DataService } from './core/services/data.service';
import * as $ from 'jquery';
import { AuthService } from './pages/Auth/services/auth.service';
import { slider } from './pages/Auth/animation/route-animation';
import { RouterOutlet } from '@angular/router';
import { registerLocaleData } from '@angular/common';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [slider]
})
export class AppComponent implements OnInit {
  title = 'Frontend-Angular';
  login?: boolean;
  loaded: boolean = false;
  layoutleft?: boolean

  constructor(private _DataService: DataService, private service: AuthService,) {

  }

  ngOnInit() {
    this.service.AuthlayoutLeft.subscribe(res => {
      this.layoutleft = res
    });
    this.service.isLogedIn.subscribe(res => {
      this.login = res
      console.log(this.login);
    });


    this._DataService.isPageLoaded.subscribe((status) => {
      console.log('called with ' + status)
      this.loaded = status;
      if (status == false) {
        // document.body.classList.add('overflow-hidden');
        $('body').addClass('overflow-hidden');
        $('body').removeClass('overflow-auto');
      } else {
        $('body').removeClass('overflow-hidden');
        $('body').addClass('overflow-auto');
      }
    })

  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }



}
