import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutComponent } from '../../component/checkout/checkout.component';
import { CartComponent } from '../../component/cart/cart.component';
import { SharedModule } from 'src/app/layout/shared/shared.module';


@NgModule({
  declarations: [
    CheckoutComponent,
    CartComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports:[
    CheckoutComponent,
    CartComponent
  ]
})
export class CartModule { }
