import { Component, OnInit } from '@angular/core';
import { AuthService } from '../Auth/services/auth.service';
import { DataService } from 'src/app/core/services/data.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {

  constructor(private _AuthService: AuthService, private _DataService: DataService ) { }

  ngOnInit(): void {
    // Promise.resolve().then(() => this._DataService.isPageLoaded.next(false));
    // Promise.resolve().then(() => this._AuthService.isLogedIn.next(true));
  }
  
  // ngAfterViewInit() {
  //   setTimeout(() => {
  //     Promise.resolve().then(() => this._DataService.isPageLoaded.next(true))
  //   }, 0);
  // }

}
