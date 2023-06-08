import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientProfileComponent } from '../../component/patient-profile/patient-profile.component';
import { SharedModule } from 'src/app/layout/shared/shared.module';
import { OrderDetailsComponent } from '../../component/order-details/order-details.component';
import { ProfileDetailsComponent } from '../../component/profile-details/profile-details.component';
import { ChangePasswordComponent } from '../../component/change-password/change-password.component';
import { MyInsuranceComponent } from '../../component/my-insurance/my-insurance.component';
import { HistoryComponent } from '../../component/history/history.component';
import { InvoicesComponent } from '../../component/invoices/invoices.component';
import { FavoritesComponent } from '../../component/favorites/favorites.component';
import { OrdersComponent } from '../../component/orders/orders.component';
import { ReviewsComponent } from '../../component/reviews/reviews.component';
import { MyAppointmentsComponent } from '../../component/my-appointments/my-appointments.component';



@NgModule({
  declarations: [
    PatientProfileComponent,
    OrderDetailsComponent,
    ProfileDetailsComponent,
    ChangePasswordComponent,
    MyInsuranceComponent,
    HistoryComponent,
    InvoicesComponent,
    FavoritesComponent,
    OrdersComponent,
    ReviewsComponent,
    MyAppointmentsComponent,
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports:[
    PatientProfileComponent,
    OrderDetailsComponent,
  ]
})
export class PatientProfileModule { }
