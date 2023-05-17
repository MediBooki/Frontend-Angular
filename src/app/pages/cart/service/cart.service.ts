import { HttpClient, HttpHeaders, HttpParams  } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { MedicinePurchased } from '../../interfaces/medicine-purchased';
import { MedicinePurchased } from 'src/app/core/interfaces/medicine-purchased';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  sharedApi: string = "http://medibookidashbord.test/api";
  medicinesQty = new BehaviorSubject(0);
  favoritesId = new BehaviorSubject<number[]>([]); // medicines IDs added to favorite

  constructor(private http:HttpClient) { }

  // General Method to Create Authorization Header
  createAuthorizationHeader(headers: HttpHeaders) {
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
          console.log(medicinesPurchased.data.user_cart_items)
          medicinesPurchased.data.user_cart_items.forEach((element:any) => {
            cartQty += Number(element.qty)
          });
          this.medicinesQty.next(cartQty);
        } else {
          console.log("hello")
          this.medicinesQty.next(0);
        }

      },
      error:(error)=>{
        console.log(error)
      }
    })
  }


  // add medicine to favorite
  addFavorite(medicineId:number):Observable<any> {
    const model = {
      "medicine_id": medicineId
    }
    let headers = new HttpHeaders();
    headers = this.createAuthorizationHeader(headers);
    return this.http.post(this.sharedApi + `/patient/wishlist/medicine` , model , {headers: headers})
  }

  // remove medicine from favorite
  removeFavorite(medicineId:number):Observable<any> {
    let headers = new HttpHeaders();
    headers = this.createAuthorizationHeader(headers);
    return this.http.delete(this.sharedApi + `/patient/wishlist/medicine/${medicineId}` , {headers: headers})
  }

  // return all favorited medicines
  getAllFavorite():Observable<any> {
    let headers = new HttpHeaders();
    headers = this.createAuthorizationHeader(headers);
    return this.http.get(this.sharedApi + `/patient/wishlist/medicine` , {headers: headers})
  }


  checkoutDetails(model:any):Observable<any> {
    let headers = new HttpHeaders();
    headers = this.createAuthorizationHeader(headers);
    return this.http.post(this.sharedApi + `/patient/orders` , model , {headers: headers}).pipe(
      catchError(error => {
        console.log(error);
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
    return this.http.post(this.sharedApi + `/patient/payments` , model , {headers: headers}).pipe(
      catchError(error => {
        console.log(error);
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
  //   //     console.log(favoriteFound)
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
    console.log(model.genders)
    // console.log(params)
    return this.http.get<any[]>(`${this.sharedApi}/patient/callback`, { params: params ,  headers: headers}).pipe(catchError((e: any) => {
      console.log(e)
      return throwError(e)
    }));

  }

}
