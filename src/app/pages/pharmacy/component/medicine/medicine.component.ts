import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';
import { CartService } from 'src/app/pages/cart/service/cart.service';
import { PharmacyService } from '../../service/pharmacy.service';
import { Medicine } from 'src/app/core/interfaces/medicine';
import { MedicinePurchased } from 'src/app/core/interfaces/medicine-purchased';
import { ToastrService } from 'ngx-toastr';

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

  @Input() medicine:Medicine;
  // @Input() favoritesFound:boolean = false;

  defaultMedicineImg:string = this._DataService.defaultNoImg;
  @Output() emitChanges= new EventEmitter<any>();

  /*=============================================( Initialization Methods )=============================================*/
  
  constructor(private _DataService:DataService ,private _PharmacyService : PharmacyService, private _CartService:CartService, private toastr: ToastrService) {
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
        this._CartService.addFavorite(this.medicine.id).subscribe({
          next:(res)=>{
            this.toastr.success(!this.rtlDir?`This Medicine Added to Favorites`:`تم اضافة الدواء الى المفضلة`, !this.rtlDir?`Favorites Result`:`ناتج التفضيلات`)
            console.log(res)
            console.log(this._CartService.favoritesId.value)
            let newFavorites = this._CartService.favoritesId.value;
            newFavorites.push(this.medicine.id);
            this._CartService.favoritesId.next(newFavorites);
            console.log(this._CartService.favoritesId.value)
          },
          error:(error)=>{
            this.toastr.error(!this.rtlDir?`An Error has occured`:`حدث خطأ ما` , `${error}`)
          }
        });
        return;
      } else if(className == "fa-heart-circle-check") {
        this.favoriteAdded = false;
        this._CartService.removeFavorite(this.medicine.id).subscribe({
          next:(res)=>{
            this.toastr.info(!this.rtlDir?`This Medicine Removed from Favorites`:`تم ازالة الدواء من المفضلة`, !this.rtlDir?`Favorites Result`:`ناتج التفضيلات`)
            console.log(res)
            let newFavorites = this._CartService.favoritesId.value;
            let removeIndex = this._CartService.favoritesId.value.indexOf(this.medicine.id); // to know index of removed medicine from favorites
            newFavorites.splice(removeIndex, 1);
            this._CartService.favoritesId.next(newFavorites);
            console.log(this._CartService.favoritesId.value);
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
  
  //         console.log(favorites.data)
  //         let favoriteFound = favorites.data.find((favorite:any) => favorite.id == this.medicine.id)
  //         console.log(favoriteFound)
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
      this._CartService.favoritesId.subscribe({
        next:(res)=>{
          // if(res.length != 0) {
            console.log(res)
            let favoriteFound = res.find((favoriteId:any) => favoriteId == this.medicine.id)
            console.log(favoriteFound)
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
  //   console.log(this.medicineFavorite);
  //   if(this.medicineFavorite.includes(this.medicine.id)) {
  //     console.log('yup')
  //   } else {
  //     console.log("nob")
  //   }

  // }

}
