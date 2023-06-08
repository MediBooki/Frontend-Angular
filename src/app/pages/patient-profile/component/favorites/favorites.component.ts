import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/core/services/data.service';
import { PatientProfileService } from '../../service/patient-profile.service';
import { Medicine } from 'src/app/core/interfaces/medicine';
import { Subscription } from 'rxjs';
import { CartService } from 'src/app/pages/cart/service/cart.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {
  // constructor & dependency injection
  constructor(private _DataService:DataService, private _PatientProfileService:PatientProfileService, private toastr: ToastrService ,  private router: Router,private _cartservice : CartService) { }

  ngOnInit(): void {
    this.getLang();
    this.getMedicines();
    this.setFavorite();
  }
/*--------------------------------------------------------------(variables)------------------------------- */
  lang:string = "en";
  rtlDir:boolean = false;
  direction:string = 'ltr';

  favMedicines:Medicine[] = [];
  medicinesSubscription = new Subscription();
  favMedicinesAPIres: any;
  allFav_notempty?:boolean=true;

/*--------------------------------------------------------------(methods)--------------------------------- */
  //----- Method 1
  // Setting Direction
  getLang() {
    this._DataService._lang.subscribe({next:(language)=>{
      this.lang = language;

      if(language == 'en')
      {
        this.rtlDir = false;
        this.direction = 'ltr';
      } else {
        this.rtlDir = true;
        this.direction = 'rtl';
      }
    }})
  }

  //----- Method 2
  getMedicines() {
    // to get all Favorites
    this._DataService._lang.subscribe({next:(language)=>{
      this.medicinesSubscription = this._cartservice.getAllFavorite().subscribe({
      next: (favMedicines) => {
        this.favMedicines = favMedicines.data;
        this.favMedicinesAPIres = favMedicines;
        this.allFav_notempty = this.favMedicines.length > 0;
        console.log( this.favMedicines);
        // this.isVisibleSpinner = false;
      },
      error: (error) => {
        this.favMedicinesAPIres = error;
        console.log(error);
        // this.isVisibleSpinner = false;
      }
    });
    }})

  }

  //----- method 3
  setFavorite() {
    let favoritesId:number[] = []
      if (localStorage.getItem("token") != null) {
        if(this._cartservice.favoritesId.value.length == 0) {
          this._cartservice.getAllFavorite().subscribe({
          next:(favorites)=>{
            console.log(favorites.data)
            favorites.data.forEach((favMedicine:any)=>{
              favoritesId.push(favMedicine.id)
            })
            this._cartservice.favoritesId.next(favoritesId);
            console.log(favoritesId)
          }
        })
      }
    }
  }

}
