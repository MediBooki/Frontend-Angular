import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartComponent } from './component/cart/cart.component';
import { CheckoutComponent } from './component/checkout/checkout.component';
import { CheckoutGuard } from 'src/app/core/guards/checkout/checkout.guard';

const routes: Routes = [
  { path: '', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent, canActivate:[CheckoutGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CartRoutingModule { }
