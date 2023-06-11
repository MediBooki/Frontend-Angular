import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';
import { PharmacyService } from '../../service/pharmacy.service';
import { Medicine } from 'src/app/core/interfaces/medicine';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-medicine',
  templateUrl: './medicine.component.html',
  styleUrls: ['./medicine.component.scss']
})
export class MedicineComponent implements OnInit {

  /*=============================================( Variables )=============================================*/

  // Direction Variables
  rtlDir:boolean = false;
  lang:string = "en";
  favoriteAdded:boolean = false;
  favoriteLoaded:boolean = false;

  // API Subscriptions Variables
  addFavoriteSubscription = new Subscription();
  removeFavoriteSubscription = new Subscription();

  @Input() medicine:Medicine;
  // @Input() favoritesFound:boolean = false;

  defaultMedicineImg:string = this._DataService.defaultNoImg;
  @Output() emitChanges= new EventEmitter<any>();

  /*=============================================( Initialization Methods )=============================================*/
  
  constructor(private _DataService:DataService ,private _PharmacyService : PharmacyService, private toastr: ToastrService) {
    this.medicine =  {
      id:0,
      name:'',
      description:'',
      price:0,
      manufactured_by:'',
      photo:'',
      category: {
        id: 0,
        name: '',
        description: '',
        photo: ''
      }
    };
   }

  ngOnInit(): void {
    this.setLang();
    // this.setFavorite();
    this.setFavorite();
  }

  /*=============================================( Component Created Methods )=============================================*/
  
  //----- Method 1
  setLang() {
    this._DataService._lang.subscribe({
      next:(lang)=>{
        this.lang = lang;
        if(lang == 'en')
        {
          this.rtlDir = false;
        } else {
          this.rtlDir = true;
        }
      }
    });
  }

  //----- Method 2
  addRemoveFavorite(eve:any) {
    if (localStorage.getItem("token") == null) {
      this.toastr.info(!this.rtlDir?`You Should Login First!`:`يجب أن تسجل الدخول أولا!`)
    } else {
    Array.from(eve.target.classList).find((className)=>{
      if(className == "fa-heart-circle-plus") // check if favorite btn is not triggered yet
      {
        this.favoriteAdded = true;
        this.addFavoriteSubscription = this._PharmacyService.addFavorite(this.medicine.id).subscribe({
          next:(res)=>{
            this.toastr.success(!this.rtlDir?`This Medicine Added to Favorites`:`تم اضافة الدواء الى المفضلة`, !this.rtlDir?`Favorites Result`:`ناتج التفضيلات`)
             
             
            let newFavorites = this._PharmacyService.favoritesId.value;
            newFavorites.push(this.medicine.id);
            this._PharmacyService.favoritesId.next(newFavorites);
             
          },
          error:(error)=>{
            this.toastr.error(!this.rtlDir?`An Error has occured`:`حدث خطأ ما` , `${error}`)
          }
        });
        return;
      } else if(className == "fa-heart-circle-check") {
        this.favoriteAdded = false;
        this.removeFavoriteSubscription = this._PharmacyService.removeFavorite(this.medicine.id).subscribe({
          next:(res)=>{
            this.toastr.info(!this.rtlDir?`This Medicine Removed from Favorites`:`تم ازالة الدواء من المفضلة`, !this.rtlDir?`Favorites Result`:`ناتج التفضيلات`)
             
            let newFavorites = this._PharmacyService.favoritesId.value;
            let removeIndex = this._PharmacyService.favoritesId.value.indexOf(this.medicine.id); // to know index of removed medicine from favorites
            newFavorites.splice(removeIndex, 1);
            this._PharmacyService.favoritesId.next(newFavorites);
             
            this.removeFavEmit();
          },
          error:(error)=>{
            this.toastr.error(!this.rtlDir?`An Error has occured`:`حدث خطأ ما` , `${error}`)
          }
        });
        return;
      }
    })
  }
  }


  removeFavEmit() {
    this.emitChanges.emit();
  }

  //----- Method 3
  // setFavorite() {
  //   // this.favoriteAdded = this._CartService.favoriteFound(this.medicine.id);
  //   if (localStorage.getItem("token") != null) {
  //     this._CartService.getAllFavorite().subscribe({
  //       next:(favorites)=>{
  
  //          
  //         let favoriteFound = favorites.data.find((favorite:any) => favorite.id == this.medicine.id)
  //          
  //         if(favoriteFound == undefined) {
  //           this.favoriteAdded = false
  //         } else {
  //           this.favoriteAdded = true
  //         }
  //         this.favoriteLoaded = true
  
  //       }
  //     })
  //   }
       
  // }

  setFavorite() {
    if(localStorage.getItem("token") != null) {
      this._PharmacyService.favoritesId.subscribe({
        next:(res)=>{
          // if(res.length != 0) {
             
            let favoriteFound = res.find((favoriteId:any) => favoriteId == this.medicine.id)
             
            if(favoriteFound == undefined) {
              this.favoriteAdded = false
            } else {
              this.favoriteAdded = true
            }
            this.favoriteLoaded = true
          // } 
          
        }
      })
    }
    
  }


  // @Input() medicineFavorite:number[] = [];

  // ngOnChanges(): void {
  //    
  //   if(this.medicineFavorite.includes(this.medicine.id)) {
  //      
  //   } else {
  //      
  //   }

  // }

  
  /*=============================================( Destroying Method )=============================================*/

  ngOnDestroy() {
    this.addFavoriteSubscription.unsubscribe();
    this.removeFavoriteSubscription.unsubscribe();
  }

}
