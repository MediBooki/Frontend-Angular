import { Component, OnInit, HostListener, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/core/services/data.service';
import { AuthService } from 'src/app/pages/Auth/services/auth.service';
import { CartService } from 'src/app/pages/cart/service/cart.service';
import { PatientProfileService } from 'src/app/pages/patient-profile/service/patient-profile.service';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {

  cartQty: number = 0;
  medicinesPurchased:any;
  lang:string = "en";
  rtlDir:boolean = false;
  direction:string = 'ltr' ;
  is_login: boolean= false;
  islogsub = this._DataService.is_login.subscribe(res => {
      console.log(res)
      if(res==true) {
        this.getCartQty();
      }
      this.is_login = res
    });
  userPhoto?:string= "../../../assets/images/user_male.jpeg" ;
  allTenants: any[] = [];

  diagnosisAPIres: any;
  testCountry:any =localStorage.getItem('tenant')
  currentContry:any
  defultCountry: any = {
    'name': 'UAE',
    'logo': '../../../assets/images/navbar-footer/uae.png'
  };

  // API Subscriptions Variables
  tenantsSubscription = new Subscription();
  medicinesSubscription = new Subscription();
  removeMedicinesSubscription = new Subscription();
  patientInfoSubscription = new Subscription();

  constructor(private _PatientProfileService:PatientProfileService,private _DataService: DataService, private _CartService: CartService, private _TranslateService: TranslateService, private _AuthService: AuthService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getLang();
    this._TranslateService.use(this.lang);
    this.getAllTanant();
    this.getCartQty();
    this._DataService.userPhoto.subscribe(res => {
      this.userPhoto = res
    });
    this.setMainCountry();
    this._DataService.is_login.subscribe(res => {
      if(res==true) {
        this.getPatientInfo();
      }
    });
    this.getCurrentCountry();

  }

  getLang() {
    this._DataService._lang.subscribe({next:(language)=>{
      this.lang = language;
      console.log(this.lang)
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

  setLang(x: string) {
    if (x == "en") {
      this.rtlDir = false;
    } else {
      this.rtlDir = true;
    }
  }

  setlangToLocal(lang: string){
    localStorage.setItem('lang',lang);
  }

  translate(lang: string) {
    this.setLang(lang)
    this._TranslateService.use(lang);
    this._DataService._lang.next(lang);
    console.log(lang);
    this.setlangToLocal(lang);
  }

  getCartQty() {
    if (localStorage.getItem("token") != null) {
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
          this.medicinesSubscription = this._CartService.getAllPurchasedMedicines(lang).subscribe({
          next: (medicinesPurchased) => { // to calculate quantity for first time (when refreshing)
            console.log(medicinesPurchased)
            console.log(medicinesPurchased.data.length != 0)
            this.medicinesPurchased = medicinesPurchased.data
            this.cartQty = 0;
            if(typeof(medicinesPurchased.data)!='string' && (typeof(medicinesPurchased.data)=='object' && medicinesPurchased.data.length!=0) && medicinesPurchased.data.user_cart_items.length != 0){
              medicinesPurchased.data.user_cart_items.forEach((element: any) => {
                this.cartQty += Number(element.qty)
              });
            } else {
              console.log("ggg")

            }

        },
        error: (error) => {
          console.log(error)
        }
      });
    }})
      this._CartService.medicinesQty.subscribe((qty) => { // to calculate quantity each time it changes
        this.cartQty = qty;
        this._CartService.getAllPurchasedMedicines("en").subscribe({
          next: (medicinesPurchased) => { // to calculate quantity for first time (when refreshing)
            this.medicinesPurchased = medicinesPurchased.data
          },
          error: (error) => {
            console.log(error)
          }
        });
      });
    }
  }

  logout(){
    this._DataService.userPhoto.next('../../../assets/images/user_male.jpeg');
    this._CartService.medicinesQty.next(0);
    this._AuthService.logout();
    this._DataService.is_login.next(false);
    localStorage.removeItem("insuranceDiscount");
    localStorage.removeItem("insuranceID")
    this.toastr.warning(!this.rtlDir?`You Logged Out From the System!`:`لقد سجلت خروجك من الموقع!`)

  }

  /*============================================( NAVBAR SCROLL to test )============================================*/

  // true means add position-fixed class ; false means remove position-fixed class
  navbarFixed: boolean = false;

  // @ViewChild('navbar') navbar: ElementRef | undefined;

  // @HostListener('window:scroll') // method triggered every scroll
  // navbarScroll() {
  //   const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  //   let navbarHeight = this.navbar?.nativeElement.offsetHeight;
  //   this.navbarFixed = scrollPosition > navbarHeight;
  // }

  // setLang() {
  //   if(localStorage.getItem("language") != null) {
  //     this.lang = JSON.parse(localStorage.getItem("language") || 'en')
  //     if(localStorage.getItem("language") == "en") {
  //       this.rtlDir = false;
  //       this.direction = "ltr"
  //     } else {
  //       this.rtlDir = true;
  //       this.direction = "rtl"
  //     }
  //   } else {
  //     localStorage.setItem("language",JSON.stringify(this.lang));
  //   }
  // }


  isVisibleDeleteSpinner:boolean = false;
  selectedDeleteMedicine:number = 0;

  //----- Method 3
  // decrease medicine amount
  removeCart(medicineId:number) {
    this.selectedDeleteMedicine = medicineId;
    this.isVisibleDeleteSpinner = true;
    this.removeMedicinesSubscription = this._CartService.removeCart(medicineId).subscribe({
      next:(message)=>{
        console.log(message)
        this.getCartQty();
        this._CartService.calculateTotalQty()
        this.isVisibleDeleteSpinner = false;
        this.selectedDeleteMedicine = 0;
      },
      error:(error)=>{
        this.isVisibleDeleteSpinner = false;
        this.selectedDeleteMedicine = 0;
      }
    })

  }




  isVisibleCartArrow:boolean = false;
  displayCartArrow(isVisibleCartArrow:any) {
    this.isVisibleCartArrow = isVisibleCartArrow;
  }

  getAllTanant() {
    this.tenantsSubscription =this._DataService.getAllTenants().subscribe({
      next:(tenants)=>{
        this.allTenants = tenants.data
        environment.tenants = tenants.data;
        const testCountry =localStorage.getItem('tenant');
        const currentDomain = testCountry?.split('/',3)[2];

        const findTenant= this.allTenants.find(function(item) {
          return item.domain == currentDomain
        });
        if(findTenant!=undefined){
          this.currentContry = findTenant;
        }else{
          this.currentContry = this.defultCountry;
        }
      }
    })
  }

  setMainCountry() {

  }

  getCountry(domain:string) {
    localStorage.setItem('tenant',`http://${domain}/api`);
  }

  getPatientInfo(){
    this.patientInfoSubscription = this._PatientProfileService.getPatientInfo(this.lang).subscribe({
      next: (patientInfo) => {
        if(patientInfo.data.photo != ''){
          this._DataService.userPhoto.next(patientInfo.data.photo)
          // this.userPhoto = this.patientInfo.photo;
        }
        // this._DataService.is_login.subscribe(res => {
        //   if(patientInfo.data.insurance){
        //     const discount = Number(patientInfo.data.insurance.discount_percentage) + Number(patientInfo.data.insurance.company_rate)
        //     localStorage.setItem("insuranceDiscount", discount.toString())
        //     localStorage.setItem("insuranceID",patientInfo.data.insurance.id)
        //   }else{
        //     localStorage.removeItem("insuranceDiscount");
        //     localStorage.removeItem("insuranceID")

        //   }
        // })
        console.log(patientInfo)
        if(patientInfo.data.insurance && patientInfo.data.insurance_status==1){
          const discount = Number(patientInfo.data.insurance.discount_percentage) + Number(patientInfo.data.insurance.company_rate)
          localStorage.setItem("insuranceDiscount", discount.toString())
          localStorage.setItem("insuranceID",patientInfo.data.insurance.id)
        }else{
          localStorage.removeItem("insuranceDiscount");
          localStorage.removeItem("insuranceID")

        }
      }
    });
  }

  getCurrentCountry(){
    // const testCountry =localStorage.getItem('tenant');
    // const currentDomain = testCountry?.split('/',3)[2];

    // const findTenant= this.allTenants.find(function(item) {
    //   return item.domain == currentDomain
    // });
    // console.log(findTenant);
  }

    /*=============================================( Destroying Method )=============================================*/

    ngOnDestroy() {
      this.patientInfoSubscription.unsubscribe();
      this.removeMedicinesSubscription.unsubscribe();
      this.medicinesSubscription.unsubscribe();
      this.tenantsSubscription.unsubscribe();
    }
    

}
