import { HttpClient, HttpHeaders, HttpParams  } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { MedicinePurchased } from '../../interfaces/medicine-purchased';
import { MedicinePurchased } from 'src/app/core/interfaces/medicine-purchased';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  sharedApi: string = environment.apimain;
  medicinesQty = new BehaviorSubject(0);
  private cartData: any;

  constructor(private http:HttpClient) { }

  // General Method to Create Authorization Header
  createAuthorizationHeader(headers: HttpHeaders) {
    console.log(localStorage.getItem("token")!);
    return headers.append('Authorization', localStorage.getItem("token")!);
  }

  getAllPurchasedMedicines(lang:string):Observable<any> {
    let headers = new HttpHeaders();
    headers = this.createAuthorizationHeader(headers);
    return this.http.get(this.sharedApi + `/patient/orders?lang=${lang}` , {headers: headers})
    ;
  }

  // increase medicine quantity to cart
  addCart(medicineId:number):Observable<any> {
    let headers = new HttpHeaders();
    headers = this.createAuthorizationHeader(headers);
    return this.http.get(this.sharedApi + `/patient/orders/${medicineId}` , {headers: headers})
  }

  // decrease medicine quantity from cart
  decreaseCart(medicineId:number):Observable<any> {
    let headers = new HttpHeaders();
    headers = this.createAuthorizationHeader(headers);
    return this.http.put(this.sharedApi + `/patient/orders/${medicineId}` , medicineId , {headers: headers})
  }

  // remove medicine from cart
  removeCart(medicineId:number):Observable<any> {
    let headers = new HttpHeaders();
    headers = this.createAuthorizationHeader(headers);
    return this.http.delete(this.sharedApi + `/patient/orders/${medicineId}` , {headers: headers})
  }

  deleteAllCart():Observable<any> {
    let headers = new HttpHeaders();
    headers = this.createAuthorizationHeader(headers);
    return this.http.get(this.sharedApi + `/patient/delete/items/cart` , {headers: headers})
  }

  getTotalQty() {
    this.calculateTotalQty();
    return this.medicinesQty.value;
  }

  calculateTotalQty() {
    let cartQty = 0
    this.getAllPurchasedMedicines("en").subscribe({
      next:(medicinesPurchased)=>{
        if(typeof(medicinesPurchased.data)!='string' && (typeof(medicinesPurchased.data)=='object' && medicinesPurchased.data.length!=0) && medicinesPurchased.data.user_cart_items != 0) {
           
          medicinesPurchased.data.user_cart_items.forEach((element:any) => {
            cartQty += Number(element.qty)
          });
          this.medicinesQty.next(cartQty);
        } else {
           
          this.medicinesQty.next(0);
        }

      },
      error:(error)=>{
         
      }
    })
  }



  checkoutDetails(model:any):Observable<any> {
    let headers = new HttpHeaders();
    headers = this.createAuthorizationHeader(headers);
    return this.http.post(this.sharedApi + `/patient/orders` , model , {headers: headers}).pipe(
      catchError(error => {
         
        return throwError('Something went wrong');
      })
    );
  }

  paymentOrder(num:number):Observable<any> {
    let model = {}
    model = {
      "status":num
    }

    let headers = new HttpHeaders();
    headers = this.createAuthorizationHeader(headers);
    console.log(headers)
    return this.http.post( `${this.sharedApi}/patient/payments` , model , {headers: headers}).pipe(
      catchError(error => {
         
        return throwError('Something went wrong');
      })
    );
  }

  // favoriteFound(medicineId:number):boolean {
  //   let found = false
  //   this.getAllFavorite().subscribe({
  //     next:(gg)=>{
  //       let favoriteFound = gg.data.find((favorite:any) => favorite.id == medicineId)
  //       if(favoriteFound == undefined) {
  //         found = false
  //       } else {
  //         found = true
  //       }
  //     }
  //   })
  //   return found;
  //       //     let favoriteFound = favorites.data.find((favorite:any) => favorite.id == this.medicine.id)
  //   //      
  //   //     if(favoriteFound == undefined) {
  //   //       this.favoriteAdded = false
  //   //     } else {
  //   //       this.favoriteAdded = true
  //   //     }
  // }

  savePaymentOnline(model: any): Observable<any> {

    let params = new HttpParams();

    for (let obj in model) {
      params = params.append(`${obj}`, model[obj]);
    }

    let headers = new HttpHeaders();
    headers = this.createAuthorizationHeader(headers);
    // const parse = JSON.parse(par)
     
    //  
    return this.http.get<any[]>(`${this.sharedApi}/patient/callback`, { params: params ,  headers: headers}).pipe(catchError((e: any) => {
       
      return throwError(e)
    }));

  }

  setcartData(data: any) {
    this.cartData = data;
    //  
  }
  

  getAppointmentData() {
    return this.cartData;
  }

}
