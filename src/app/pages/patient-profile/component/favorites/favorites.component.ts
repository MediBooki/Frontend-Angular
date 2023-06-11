import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/core/services/data.service';
import { PatientProfileService } from '../../service/patient-profile.service';
import { Medicine } from 'src/app/core/interfaces/medicine';
import { Subscription } from 'rxjs';
import { PharmacyService } from 'src/app/pages/pharmacy/service/pharmacy.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit, OnDestroy {
  // constructor & dependency injection
  constructor(private _DataService:DataService, private _PatientProfileService:PatientProfileService, private toastr: ToastrService ,  private router: Router,private _pharmacyService : PharmacyService) { }

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
  favMedicinesAPIres: any;
  allFav_notempty?:boolean=true;

  // API Subscriptions Variables
  medicinesSubscription = new Subscription();
  favoritesSubscription = new Subscription();

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
      this.medicinesSubscription = this._pharmacyService.getAllFavorite(this.lang).subscribe({
      next: (favMedicines) => {
        this.favMedicines = favMedicines.data;
        this.favMedicinesAPIres = favMedicines;
        this.allFav_notempty = this.favMedicines.length > 0;
        console.log( this.favMedicines);
        // this.isVisibleSpinner = false;
      },
      error: (error) => {
        this.favMedicinesAPIres = error;
        this.allFav_notempty = false;
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
        if(this._pharmacyService.favoritesId.value.length == 0) {
          this.favoritesSubscription = this._pharmacyService.getAllFavorite(this.lang).subscribe({
          next:(favorites)=>{
            console.log(favorites.data)
            favorites.data.forEach((favMedicine:any)=>{
              favoritesId.push(favMedicine.id)
            })
            this._pharmacyService.favoritesId.next(favoritesId);
            console.log(favoritesId)
          }
        })
      }
    }
  }

  
  /*=============================================( Destroying Method )=============================================*/

  ngOnDestroy() {
    this.medicinesSubscription.unsubscribe();
    this.favoritesSubscription.unsubscribe();
  }

}
