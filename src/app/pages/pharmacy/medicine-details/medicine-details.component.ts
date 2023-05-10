import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../../core/services/data.service';
import { CartService } from '../../cart/service/cart.service';
import { AuthService } from '../../Auth/services/auth.service';
import {ActivatedRoute} from '@angular/router';
import { Medicine } from '../../../core/interfaces/medicine';
import { MedicinePurchased } from '../../../core/interfaces/medicine-purchased';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

// import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-medicine-details',
  templateUrl: './medicine-details.component.html',
  styleUrls: ['./medicine-details.component.scss']
})
export class MedicineDetailsComponent implements OnInit {

  /*=============================================( Variables )=============================================*/

  // Direction Variables
  rtlDir:boolean = false;
  lang:string = "en";
  direction:string = "ltr";
  
  // API Variables
  medicineDetails:Medicine;
  medicineSubscription = new Subscription();
  medicineId:any;
  langSubscription = new Subscription();
  FavoritesSubscribtion = new Subscription();

  
      // Filter and Search Form Variables
      medicineFilterForm : FormGroup;



  // Other Variables
  medicineQuantity:number = 0;
  // purchasedFound?:MedicinePurchased;
  favoriteAdded:boolean = false;
  isVisibleSpinner:boolean = false;
  isLogedIn:boolean = localStorage.getItem("token") != null;

  // relatedCarousel: OwlOptions = {} // Enabling Owl Carousel for Specialization Section
  navText: string[] = ["<i class='carousel-left fa-solid fs-4 fa-arrow-left'></i>", "<i class='carousel-right fa-solid fs-4 fa-arrow-right'></i>"]; // arrows direction in owl carousel


  // first section in component to know it's height
  @ViewChild('firstSection') firstSection: ElementRef | undefined; 
  defaultMedicineImg:string = this._DataService.defaultNoImg;
  

  /*=============================================( Initialization Methods )=============================================*/
  
  constructor(private _DataService:DataService , private _AuthService:AuthService , private _CartService:CartService, private _FormBuilder:FormBuilder, private _ActivatedRoute:ActivatedRoute, private toastr: ToastrService, private router: Router) {
    this.medicineDetails =  {
      id:0,
      name:'',
      description:'',
      price:'',
      manufactured_by:'',
      photo:'',
      category: {
        id: 0,
        name: '',
        description: '',
        photo: ''
      }
    };

    this.medicineFilterForm = this._FormBuilder.group({
      name:"",
      minPrice: "",
      maxPrice: "",
      categories: new FormArray([])
    })
   }

  ngOnInit(): void {
    this._ActivatedRoute.params.subscribe((params) => {
      this.medicineId = params["id"];
      this.getMedicineDetails();
      // console.log(params["id"]);
      // console.log(this._ActivatedRoute.snapshot.data);
    });
    // this.isVisibleSpinner = true;
    Promise.resolve().then(()=>this._DataService.isPageLoaded.next(false));
    Promise.resolve().then(() => this._AuthService.isLogedIn.next(true));
    this.getLang();
    
    this.getMedicineQuantity();
    // this.setFavorite();
    // this.filterMedicinesCategory(this.medicineDetails.category.id);
    console.log(this.medicineId);
    
  }

   // when view load completely
   ngAfterViewInit() {
    setTimeout(() => {
      Promise.resolve().then(()=>this._DataService.isPageLoaded.next(true))
    }, 0);
  }
  

  categoryMedicines:any;
  relatedCarousel: OwlOptions = {} // Enabling Owl Carousel for Specialization Section
  filterMedicinesCategory() {

    this.relatedCarousel = {
      // margin: 30,
      rtl: this.rtlDir,
      loop: true,
      nav: true,
      autoplay: true,
      autoplayTimeout: 3500,
      // autoplayHoverPause:true,
      navText: this.navText,
      responsive: {
        0: {
          items: 1
        },
        600: {
          items: 2
        },
        900: {
          items: 3
        }
      }
    };

  // sectionArrayChecked:boolean[] = [];
    this.medicineFilterForm.value["categories"].splice(0, this.medicineFilterForm.value["categories"].length);
  
    // if(specializationId == 'all') {
    //   this.getFilteredDoctors();
    // } else {
      console.log(this.medicineDetails.category.id)
      this.medicineFilterForm.value["categories"].push(this.medicineDetails.category.id)
      console.log(this.medicineFilterForm.value["categories"])
      this._DataService.getFilteredMedicines(this.medicineFilterForm.value, this.lang, 1).subscribe({
        next:(res)=>{
          console.log(res.data)
          const filteredMedicines = res.data.filter((medicine:any) => medicine.id !== this.medicineDetails.id);
          this.categoryMedicines = filteredMedicines;
          console.log(filteredMedicines)
          // this.isVisibleSpinner = false;
        }
      })
    // }

    
  }
  /*=============================================( Component Created Methods )=============================================*/
  
  //----- Method 1
  @HostListener('window:scroll') // method triggered every scroll
  checkScroll() {
    this._DataService.firstSectionHeight = this.firstSection?.nativeElement.offsetHeight;
  }
  
  //----- Method 2
  getLang() {
    this._DataService._lang.subscribe({
      next: (language) => {
        this.lang = language;

        if (language == 'en') {
          this.rtlDir = false;
          this.navText = ["<i class='carousel-left fa-solid fs-4 fa-arrow-left'></i>", "<i class='carousel-right fa-solid fs-4 fa-arrow-right'></i>"]; // arrows direction in owl carousel
          this.direction = 'ltr';
        } else {
          this.rtlDir = true;
          this.navText = ["<i class='carousel-left fa-solid fs-4 fa-arrow-right'></i>", "<i class='carousel-right fa-solid fs-4 fa-arrow-left'></i>"];
          this.direction = 'rtl';
        }

    // this.filterMedicinesCategory();
    // this.filterMedicinesCategory();
      }
    })
      
  }
  habd = new BehaviorSubject(0)
  //----- Method 3
  getMedicineDetails() {
    this.isVisibleSpinner = true;
    // this.medicineId = this._ActivatedRoute.snapshot.params["id"];
    // this.habd.next(this._ActivatedRoute.snapshot.params["id"])
    // to subscribe in language to know in case of changing
    this.langSubscription = this._DataService._lang.subscribe({
      next:(lang)=>{
        this.lang = lang;
        if(lang == 'en')
        {
          this.rtlDir = false;
          this.direction = 'ltr';
        } else {
          this.rtlDir = true;
          this.direction = 'rtl';
        }
        this.habd.subscribe((rere)=>{
          console.log(rere)
        })
        // to get all medicines
        this.medicineSubscription = this._DataService.getSpecificMedicine(this.medicineId,this.lang).subscribe({
          next: (medicine)=>{
            this.medicineDetails = medicine.data;
            // this.setMedicineAmount();
            console.log(this.medicineDetails)
            // this.isVisibleSpinner = false;
            window.scroll({ 
              top: this.firstSection?.nativeElement.offsetHeight, 
              left: 0, 
              behavior: 'smooth' 
            });
            this.setMedicineFavorite();
            this.setFavorite();
            this.filterMedicinesCategory();
          }
    
        });
      }
    })
  }



  //----- Method 6
  // to ensure that quantity input accepts only numbers
  // numberOnly(event:any): boolean 
  // {
  //   const charCode = (event.which) ? event.which : event.keyCode;
  //   console.log(event)
  //   return ((charCode > 31 && (charCode < 48 || charCode > 57)) || this.amount.toString().length >=1 || (this.amount.toString().length == 0 && charCode == 48)) ?  false :  true;
  // }

  //----- Method 7
  addFavorite(eve:any) {
    if (localStorage.getItem("token") == null) {
      this.toastr.info(!this.rtlDir?`You Should Login First!`:`يجب أن تسجل الدخول أولا!`)
    } else {
    Array.from(eve.target.classList).find((className)=>{
      if(className == "btn-not-active")
      {
        this.favoriteAdded = true;
        this._CartService.addFavorite(this.medicineDetails.id).subscribe({
          next:(res)=>{
            this.toastr.success(!this.rtlDir?`This Medicine Added to Favorites`:`تم اضافة الدواء الى المفضلة`, !this.rtlDir?`Favorites Result`:`ناتج التفضيلات`)
            console.log(res)
            let newFavorites = this._CartService.favoritesId.value;
            newFavorites.push(this.medicineDetails.id);
            this._CartService.favoritesId.next(newFavorites);
            console.log(this._CartService.favoritesId.value)
          },
          error:(error)=>{
            this.toastr.error(!this.rtlDir?`An Error has occured`:`حدث خطأ ما` , `${error}`)
          }
        });
        return;
      } else if(className == "btn-active") {
        this.favoriteAdded = false;
        this._CartService.removeFavorite(this.medicineDetails.id).subscribe({
          next:(res)=>{
            this.toastr.info(!this.rtlDir?`This Medicine Removed from Favorites`:`تم ازالة الدواء من المفضلة`, !this.rtlDir?`Favorites Result`:`ناتج التفضيلات`)
            console.log(res)
            let newFavorites = this._CartService.favoritesId.value;
            let removeIndex = this._CartService.favoritesId.value.indexOf(this.medicineDetails.id); // to know index of removed medicine from favorites
            newFavorites.splice(removeIndex, 1);
            this._CartService.favoritesId.next(newFavorites);
            console.log(this._CartService.favoritesId.value)
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

  //----- Method 8
  // setMedicineAmount() {
  //   // to check whether the product were purchased or not to make amount equalls in each component and to get the right amount of product if it was purchased
  //   if(this.purchasedFound = this._CartService.medicinesPurchasedGetter.find( ({ medicine }) => medicine.id === Number(this.medicineDetails.id) ))
  //   {
  //     console.log(this.purchasedFound);
  //     this.amount = this.purchasedFound.quantity;
  //   }
  // }

  addCart(medicineId:number) {
    if (localStorage.getItem("token") == null) {
      this.toastr.info(!this.rtlDir?`You Should Login First!`:`يجب أن تسجل الدخول أولا!`)
    } else {
      this.isVisibleSpinner = true;
      this._CartService.addCart(medicineId).subscribe({
        next:(message)=>{
          console.log(message)
          this._CartService.calculateTotalQty();
          this.getMedicineQuantity();
          setTimeout(() => {
            this.isVisibleSpinner = false;
            this.toastr.success(!this.rtlDir?`This Medicine Added to Cart`:`تم اضافة الدواء الى عربة الشراء`, !this.rtlDir?`Cart Result`:`ناتج عربة الشراء`)
          }, 700);
        },
        error:(error)=>{
          this.toastr.error(this.rtlDir?`An Error has occured`:`حدث خطأ ما` , `${error}`)
        }
      })
      // this._CartService.calculateTotalQty();
      // this._CartService.medicinesPurchasedSetter = {medicine:this.medicineDetails , quantity:this.amount};
      // console.log(this.medicineQuantity)
    }
    

  }

  getMedicineQuantity() {
    if (localStorage.getItem("token") != null) {
      this._CartService.getAllPurchasedMedicines("en").subscribe({
        next:(medicines)=>{
          if(typeof(medicines.data)!='string' && (typeof(medicines.data)=='object' && medicines.data.length!=0) && medicines.data.user_cart_items != 0) {
            console.log(medicines.data.user_cart_items)
            let medicineQuantityFound = medicines.data.user_cart_items.find((medicine:any)=>medicine.id == this.medicineDetails.id);
            console.log(medicineQuantityFound)
            if(medicineQuantityFound != null) {
              this.medicineQuantity = medicineQuantityFound.qty
            }
          }
        }
      })
    }
  }




  setFavorite() {
    let favoritesId:number[] = []
    if (localStorage.getItem("token") != null) {
      // if(this._CartService.favoritesId.value.length == 0) {
    this.FavoritesSubscribtion = this._CartService.getAllFavorite().subscribe({
      next:(favorites)=>{
        // this.isVisibleSpinner = false;
        console.log(favorites.data)
        favorites.data.forEach((favMedicine:any)=>{
          favoritesId.push(favMedicine.id)
        })
        this._CartService.favoritesId.next(favoritesId);
        console.log(favoritesId)
      }
    })
  // }
  }
  }

  setMedicineFavorite() {
    // this.favoriteAdded = this._CartService.favoriteFound(this.medicine.id);
    if (localStorage.getItem("token") != null) {
      this._CartService.getAllFavorite().subscribe({
        next:(favorites)=>{
  
          console.log(favorites.data)
          let favoriteFound = favorites.data.find((favorite:any) => favorite.id == this.medicineDetails.id)
          console.log(favoriteFound)
          if(favoriteFound == undefined) {
            this.favoriteAdded = false
          } else {
            this.favoriteAdded = true
          }
          this.isVisibleSpinner = false;
      //     // let medicineQuantityFound = medicines.data.user_cart_items.find((medicine:any)=>medicine.id == this.medicineDetails.id);
  
      //     // this.allFavorites = favorites.data;
      //     // for (let i = 0; i < favorites.data.length; i++) {
      //     //   console.log(favorites.data[i].id)
      //     //   // this.favoritesId.push(favorites.data[i].id)
      //     // }
  
        },
        error:()=>{
          // this.isVisibleSpinner = false;
        }
      })
    } else {
      console.log(this.isVisibleSpinner)
      this.isVisibleSpinner = false;
    }
       
  }

/*
  changeCarousels() {

    this.relatedCarousel = {
      margin: 30,
      rtl: this.rtlDir,
      loop: true,
      nav: true,
      autoplay: true,
      autoplayTimeout: 3500,
      // autoplayHoverPause:true,
      navText: this.navText,
      responsive: {
        0: {
          items: 1
        },
        600: {
          items: 2
        },
        768: {
          items: 3
        },
        900: {
          items: 4
        }
      }
    };

  }
  */

  
    /*=============================================( Destroying Method )=============================================*/

    ngOnDestroy() {
      this.medicineSubscription.unsubscribe();
      this.langSubscription.unsubscribe();
      this.FavoritesSubscribtion.unsubscribe();
      const currentUrl = this.router.url;
    if(!currentUrl.includes("pharmacy")) {
      // this.filteredContent = [];
      localStorage.setItem("filteredCategoryContent",JSON.stringify([]));
      this.medicineFilterForm.patchValue({
        name:'',
        minPrice:'',
        maxPrice:'',
        categories:[]
      })
      localStorage.setItem("medicineFilterForm",JSON.stringify(this.medicineFilterForm.value)); // initialize empty filter form in localstorage
    }
    }
  
}
