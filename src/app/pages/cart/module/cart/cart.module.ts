import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutComponent } from '../../component/checkout/checkout.component';
import { CheckoutSuccessComponent } from '../../component/checkout-success/checkout-success.component';
import { CartComponent } from '../../component/cart/cart.component';
import { SharedModule } from 'src/app/layout/shared/shared.module';


@NgModule({
  declarations: [
    CheckoutComponent,
    CheckoutSuccessComponent,
    CartComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports:[
    CheckoutComponent,
    CheckoutSuccessComponent,
    CartComponent
  ]
})
export class CartModule { }
