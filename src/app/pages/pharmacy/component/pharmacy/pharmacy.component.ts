import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';
import { CartService } from 'src/app/pages/cart/service/cart.service';
import { AuthService } from 'src/app/pages/Auth/services/auth.service';
import { MedicineCategory } from 'src/app/core/interfaces/medicine-category';
import { Medicine } from 'src/app/core/interfaces/medicine';
import { MedicinePurchased } from 'src/app/core/interfaces/medicine-purchased';
import * as $ from 'jquery';
import { Subscription } from 'rxjs';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Options } from '@angular-slider/ngx-slider';
import { Router } from '@angular/router';
import { PharmacyService } from '../../service/pharmacy.service';


@Component({
  selector: 'app-pharmacy',
  templateUrl: './pharmacy.component.html',
  styleUrls: ['./pharmacy.component.scss']
})
export class PharmacyComponent implements OnInit {

  /*=============================================( Variables )=============================================*/

  // Direction Variables
  rtlDir:boolean = false;
  lang:string = "en";
  direction:string = "ltr";
  
  // API Variables
  allMedicines:Medicine[] = [];
  medicinesSubscription = new Subscription();
  langSubscription = new Subscription();
  FavoritesSubscribtion = new Subscription();
  allCategories:MedicineCategory[] = [];

  // Pagination Configuration Variables
  numMedicinesPerPage:number = 15; // number of doctors displayed per one page
  page:any=1; // set current page
  totalRecords:number = 0; // number of all doctors in whole API

  // Filter and Search Form Variables
  medicineFilterForm : FormGroup;
  categoryArrayChecked:boolean[] = [];
  filteredContent:string[] = []; // names of categories filtered by
  filterArrays:string[] = ["categories"]; // names of arrays in filter form
  
  // Range Slider Variables
  lowPrice: number = 0;
  highPrice: number = 20;
  smallLowPrice: number = 0;
  smallHighPrice: number = 20;
  rangeOptions: Options = { // filter trigger
    floor: 0,
    ceil: 100,
    rightToLeft: this.rtlDir
  };
  smallRangeOptions: Options = { // small filter trigger
    floor: 0,
    ceil: 100,
    rightToLeft: this.rtlDir
  };

  // Other Variables
  noDataError:any= ""; // in case of error
  smallFilterVisible:boolean = false; // to show small filter
  cartMedicines:MedicinePurchased[] = [];
  isVisibleSpinner:boolean = false;
  noData:boolean = false;
  numOfMedicines:number = 0;
  
  // first section in component to know it's height
  @ViewChild('firstSection') firstSection: ElementRef | undefined; 
  

  /*=============================================( Initialization Methods )=============================================*/
  
  constructor(private _DataService:DataService ,private _PharmacyService:PharmacyService, private _AuthService:AuthService , private _CartService:CartService, private _FormBuilder:FormBuilder, private toastr: ToastrService, private router: Router) {
    this.medicineFilterForm = this._FormBuilder.group({
      name:"",
      minPrice: "",
      maxPrice: "",
      categories: new FormArray([])
    })
  }

  ngOnInit(): void {
    Promise.resolve().then(()=>this._DataService.isPageLoaded.next(false));
    Promise.resolve().then(() => this._AuthService.isLogedIn.next(true));
    this.getFilteredForm(); // to set filter form and use localstorage
    this.getFilteredMedicines(); // get filtered medicines from API
    this.getCategories(); // get categories from API
    this.setFavorite();
    this.getCounterVals();
    this.isVisibleSpinner = true;
  }

   // when view load completely
   ngAfterViewInit() {
    setTimeout(() => {
      Promise.resolve().then(()=>this._DataService.isPageLoaded.next(true))
    }, 0);
  }


  /*=============================================( Component Created Methods )=============================================*/
  
  //----- Method 1
  @HostListener('window:scroll') // method triggered every scroll
  checkScroll() {
    this._DataService.firstSectionHeight = this.firstSection?.nativeElement.offsetHeight;
  }


  /*---------------------------------------------( API )---------------------------------------------*/

  //----- Method 2
  // to get medicines by subscribing on API
  getFilteredMedicines() {
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

        this.isVisibleSpinner = true;

        // to get all doctors
        this.medicinesSubscription = this._DataService.getFilteredMedicines(this.medicineFilterForm.value, lang, this.page).subscribe({
          next: (medicines)=>{
            this.noData = medicines.data.length == 0 ? true : false // no data will be true in case that filteredDoctors is empty
            this.totalRecords = medicines.count.count
            console.log(this.totalRecords)
            this.allMedicines = medicines.data;
            console.log(this.allMedicines)
            if (this.page == 1) {
              this.numMedicinesPerPage = medicines.data.length // length of one page in API
            }
            // this.numMedicinesPerPage = medicines.data.length // length of one page in API
            this.changeRangeSlider(medicines.count.minPrice , medicines.count.maxPrice); // to trigger range slider and init it
            this.isVisibleSpinner = false;            
          },
          error:(error)=>{
            this.noDataError = error;
            this.isVisibleSpinner = false;
          }
    
        });
    }})
  }


  //----- Method 3
  // get all categories
  getCategories() {
    this._DataService._lang.subscribe({
      next: (lang) => {
        this.lang = lang;
        if (lang == 'en') {
          this.rtlDir = false;
          this.direction = 'ltr';
        } else {
          this.rtlDir = true;
          this.direction = 'rtl';
        }

        this._DataService.getCategories(this.lang).subscribe({
          next:(categories)=>{
            this.allCategories = categories.data;
            console.log(this.allCategories)
            this.getSpecificCategory(); // to change name when change dir
          }
        })
      }
    })
  }

  //----- Method 4
  // to change range slider when getting medicines
  changeRangeSlider(minPrice:number , maxPrice:number) {

    // set range slider to localstorage values in case that min and max prices exist in localstorage
    if(localStorage.getItem('medicineFilterForm') != null && JSON.parse(localStorage.getItem("medicineFilterForm")!).minPrice != "" && JSON.parse(localStorage.getItem("medicineFilterForm")!).maxPrice != "") {
      this.lowPrice = JSON.parse(localStorage.getItem("medicineFilterForm")!).minPrice;
      this.highPrice = JSON.parse(localStorage.getItem("medicineFilterForm")!).maxPrice;
      this.smallLowPrice = JSON.parse(localStorage.getItem("medicineFilterForm")!).minPrice;
      this.smallHighPrice = JSON.parse(localStorage.getItem("medicineFilterForm")!).maxPrice;
    } else {
      this.lowPrice =minPrice;
      this.highPrice = maxPrice;
      this.smallLowPrice =minPrice;
      this.smallHighPrice = maxPrice;
    }

    // trigger range options
    this.rangeOptions = {
      floor:  minPrice,
      ceil: maxPrice,
      rightToLeft: this.rtlDir
    };

    // this.rangeOptions.ceil = medicines.count.maxPrice;
    this.smallRangeOptions = {
      floor:  minPrice,
      ceil: maxPrice,
      rightToLeft: this.rtlDir
    };
  }


  /*---------------------------------------------( Init FilterForm )---------------------------------------------*/

  //----- Method 5
  // set local storage and filter form
  getFilteredForm() {
    if (localStorage.getItem('medicineFilterForm') != null) {

      // to set string filter items from local storage
      this.medicineFilterForm.patchValue({
        name:JSON.parse(localStorage.getItem("medicineFilterForm")!).name,
        minPrice:JSON.parse(localStorage.getItem("medicineFilterForm")!).minPrice,
        maxPrice:JSON.parse(localStorage.getItem("medicineFilterForm")!).maxPrice
      })

      console.log(this.medicineFilterForm.value["categories"])

      // to set array filter items from local storage
      this.filterArrays.forEach((filterName)=>{
        console.log(filterName)
        JSON.parse(localStorage.getItem("medicineFilterForm")!)[filterName].forEach((filterNum:any) => {
          this.medicineFilterForm.value[filterName].push(filterNum);
          switch (filterName) {
            case "categories":
            this.categoryArrayChecked[Number(filterNum)] = true; // to 
            break;

            default:
              break;
          }
        });
      })
      
    } else { // in case that no local storage
      localStorage.setItem("medicineFilterForm",JSON.stringify(this.medicineFilterForm.value)); // initialize empty filter form in localstorage
    }

    if (localStorage.getItem('filteredCategoryContent') != null) {
      this.filteredContent = JSON.parse(localStorage.getItem("filteredCategoryContent")!)
    }
  }


  /*---------------------------------------------( Pagination )---------------------------------------------*/

  //----- Method 6
  // changing page in pagination
  changePage(pageNum:any) {
    this.page=pageNum;
    this.setFilterForm();
    this.getFilteredMedicines();
  }


  /*---------------------------------------------( Small Filter )---------------------------------------------*/

  //----- Method 7
  showSmallFilter() {
    this.matchFilterPrice()
    this.smallFilterVisible = true;
    $('body').removeClass('overflow-auto');
    $('body').addClass('overflow-hidden');
  }

  //----- Method 8
  hideSmallFilter() {
    this.matchFilterPrice()
    this.smallFilterVisible = false;
    $('body').addClass('overflow-auto');
    $('body').removeClass('overflow-hidden');

  }


  
  /*---------------------------------------------( Filter Form Logic )---------------------------------------------*/

  //----- Method 9
  // triggered when check or uncheck any filter input
  getStats(event:any,formControlName:string) {
    console.log(JSON.parse(localStorage.getItem("medicineFilterForm")!)[formControlName])
    // if(JSON.parse(localStorage.getItem("medicineFilterForm")!)[formControlName].includes(event.target.value)) { // in case that checkbox checked before and clicked then remove check
    
    // to check or uncheck the exact checkbox input
    switch (formControlName) {
      case "categories":
        this.categoryArrayChecked[event.target.value] = event.target.checked
        break;

      default:
        break;
    }

    if(!event.target.checked) { // in case that checkbox unchecked then remove check and update UI
      this.setFilterForm(); // set filter form with local storage value
      let removeIndex = this.medicineFilterForm.value[formControlName].indexOf(event.target.value); // to know index of unchecked input
      if (removeIndex !== -1) {
        this.medicineFilterForm.value[formControlName].splice(removeIndex, 1); // to delete unchecked input
      }
      this.toastr.success(!this.rtlDir?`Filter by ${formControlName} has been unset!`:`تم ازالة تصنيف الأدوية` , !this.rtlDir?`Filter Result`:`ناتج التصنيف`)
    } else {
        this.page = 1;
        this.setFilterForm(); // set filter form with local storage value
        this.medicineFilterForm.value[formControlName].push(event.target.value); // add new filter measure in filter form
        this.toastr.success(!this.rtlDir?`Filter by ${formControlName} has been set successfully!`:`تم تصنيف الأدوية بنجاح` , !this.rtlDir?`Filter Result`:`ناتج التصنيف`)
    }

    this.getFilteredMedicines(); // filter medicines based on filter form
    localStorage.setItem("medicineFilterForm",JSON.stringify(this.medicineFilterForm.value)); // put latest changes in localstorage
    
  }

  //----- Method 10
  GetCategoryStats(event: any) {
    this.getStats(event,'categories')
    this.getSpecificCategory(); // get names of categories filtered by
  }
  
  //----- Method 11
  // to know names of categories filtered by
  getSpecificCategory() {
    let checkedCategoriesArr:string[] = [] // array to put all checked categories in
    JSON.parse(localStorage.getItem("medicineFilterForm")!).categories.forEach((element:any) => { // loop on all specializations to get names of checked ones
      let getSpecificCategory = this.allCategories.find((medicine:any)=>medicine.id == element); // compare each value in sections array with all specializations array to get name
      if(getSpecificCategory != null) {
        checkedCategoriesArr.push(getSpecificCategory.name)
      }
    });
    
    this.filteredContent = checkedCategoriesArr;
    localStorage.setItem("filteredCategoryContent",JSON.stringify(this.filteredContent))
  }

  //----- Method 12
  // to set filter form with local storage value after each transaction
  setFilterForm() {
    this.filterArrays.forEach((filterName)=>{ // loop on arrays names exist in filter form
      this.medicineFilterForm.value[filterName].splice(0, this.medicineFilterForm.value[filterName].length); // truncate filter form
      JSON.parse(localStorage.getItem("medicineFilterForm")!)[filterName].forEach((filterNum:any) => { // loop on each localstorage array item to put in filter form
        this.medicineFilterForm.value[filterName].push(filterNum);
      });
    })
  }

  //----- Method 13
  // triggered when we submit price range
  submitPrice() {
    this.page = 1;
    console.log(this.lowPrice)
    console.log(this.highPrice)
    // Number(this.medicineFilterForm.get("minPrice")?.value) <= Number(this.medicineFilterForm.get("maxPrice")?.value) || (Number(this.medicineFilterForm.get("minPrice")?.value)==0 || Number(this.medicineFilterForm.get("maxPrice")?.value)==0)

    if(this.smallFilterVisible) {
      this.medicineFilterForm.get("minPrice")?.setValue(this.smallLowPrice);
      this.medicineFilterForm.get("maxPrice")?.setValue(this.smallHighPrice);
    } else {
      this.medicineFilterForm.get("minPrice")?.setValue(this.lowPrice);
      this.medicineFilterForm.get("maxPrice")?.setValue(this.highPrice);
    }
    this.setFilterForm(); // set filter form with local storage value
    localStorage.setItem("medicineFilterForm",JSON.stringify(this.medicineFilterForm.value)); // put new values in localstorage
    this.getFilteredMedicines();
    this.toastr.success(!this.rtlDir?`Filter by Price has been set successfully!`:`تم تصنيف الأدوية بالسعر بنجاح` , !this.rtlDir?`Filter Result`:`ناتج التصنيف`)
    console.log(Number(this.medicineFilterForm.get("minPrice")?.value))
  }

  //----- Method 14
  // called when open or close small filter to match filter price value with small filter price value
  matchFilterPrice() {
    if(localStorage.getItem('medicineFilterForm') != null) {
      this.medicineFilterForm.patchValue({
        minPrice:JSON.parse(localStorage.getItem("medicineFilterForm")!).minPrice,
        maxPrice:JSON.parse(localStorage.getItem("medicineFilterForm")!).maxPrice
      })
    }
  }


  /*---------------------------------------------( Search Form Logic )---------------------------------------------*/

  //----- Method 15
  // when clicking on search button 
  submitForm() {
    this.page = 1;
    this.setFilterForm(); // set filter form with local storage value
    localStorage.setItem("medicineFilterForm",JSON.stringify(this.medicineFilterForm.value)); // put new values in localstorage
    this.getFilteredMedicines();
    this.toastr.success(!this.rtlDir?`Searching Medicines by Name: ${this.medicineFilterForm.value['name']}`:`البحث عن الأدوية باسم: ${this.medicineFilterForm.value['name']}`)
  }

  //----- Method 16
  // when click on repeat icon on search input
  resetSearch(inputEventInfo:any) {
    this.page = 1;
    this.setFilterForm(); // set filter form with local storage value
    this.medicineFilterForm.get("name")?.setValue("");
    localStorage.setItem("medicineFilterForm",JSON.stringify(this.medicineFilterForm.value)); // put new values in localstorage
    this.getFilteredMedicines();
    this.medicineFilterForm.controls[inputEventInfo.attributes.formcontrolname.nodeValue].setValue("") // to reset input search
    this.toastr.success(!this.rtlDir?`Searching All Medicines`:`البحث عن كل الأدوية`)
  }


  // favoritesId:number[] = []

  setFavorite() {
    let favoritesId:number[] = []
    if (localStorage.getItem("token") != null) {
      if(this._CartService.favoritesId.value.length == 0) {
        this.FavoritesSubscribtion = this._CartService.getAllFavorite().subscribe({
      next:(favorites)=>{
        console.log(favorites.data)
        favorites.data.forEach((favMedicine:any)=>{
          favoritesId.push(favMedicine.id)
        })
        this._CartService.favoritesId.next(favoritesId);
        console.log(favoritesId)
      }
    })
  }
  }
  }

  // favoritesFound(medicineId:number):boolean {
  //   let found = this.allFavorites.find((favorite:any) => favorite.id == medicineId)
  //   console.log(found)
    
  //   return found == undefined? false : true
  // }


  // setFavorite(medicineId:any):boolean {
  //   // this.favoriteAdded = this._CartService.favoriteFound(this.medicine.id);
  //   if (localStorage.getItem("token") != null) {
  //     this._CartService.getAllFavorite().subscribe({
  //       next:(favorites)=>{
  
  //         console.log(favorites.data)
  //         let favoriteFound = favorites.data.find((favorite:any) => favorite.id == medicineId)
  //         console.log(favoriteFound)
  //         if(favoriteFound == undefined) {
  //           return false
  //         } else {
  //           return true
  //         }
  //         return true
  
  //       }
  //     })
  //   }
  //   return false;
  // }

  getCounterVals() {
    this._DataService.getCounterVals().subscribe({
      next:(res)=>{
        this.numOfMedicines = res.medicine;
      }
    })
  }

  /*=============================================( Destroying Method )=============================================*/

  ngOnDestroy() {
    this.medicinesSubscription.unsubscribe();
    this.langSubscription.unsubscribe();
    this.FavoritesSubscribtion.unsubscribe();
    const currentUrl = this.router.url;
    if(!currentUrl.includes("pharmacy")) {
      this.filteredContent = [];
      localStorage.setItem("filteredCategoryContent",JSON.stringify(this.filteredContent));
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
