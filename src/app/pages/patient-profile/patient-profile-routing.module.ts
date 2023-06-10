import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientProfileComponent } from './component/patient-profile/patient-profile.component';
import { ProfileDetailsComponent } from './component/profile-details/profile-details.component';
import { ChangePasswordComponent } from './component/change-password/change-password.component';
import { MyAppointmentsComponent } from './component/my-appointments/my-appointments.component';
import { MyInsuranceComponent } from './component/my-insurance/my-insurance.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { HistoryComponent } from './component/history/history.component';
import { FavoritesComponent } from './component/favorites/favorites.component';
import { InvoicesComponent } from './component/invoices/invoices.component';
import { OrdersComponent } from './component/orders/orders.component';
import { ReviewsComponent } from './component/reviews/reviews.component';

const routes: Routes = [
  { path: '', component: PatientProfileComponent },
  { path: '', redirectTo: 'details', pathMatch: 'full' },
  { path: 'details', component: ProfileDetailsComponent, canActivate:[AuthGuard]},
  { path: 'change-password', component: ChangePasswordComponent, canActivate:[AuthGuard]},
  { path: 'insurance', component: MyInsuranceComponent, canActivate:[AuthGuard]},
  { path: 'appointments', component: MyAppointmentsComponent, canActivate:[AuthGuard]},
  { path: 'history', component: HistoryComponent, canActivate:[AuthGuard]},
  { path: 'invoices', component: InvoicesComponent, canActivate:[AuthGuard]},
  { path: 'favorites', component: FavoritesComponent, canActivate:[AuthGuard]},
  { path: 'orders', component: OrdersComponent, canActivate:[AuthGuard]},
  { path: 'reviews', component: ReviewsComponent, canActivate:[AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientProfileRoutingModule { }
