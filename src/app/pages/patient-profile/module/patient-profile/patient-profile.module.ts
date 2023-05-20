import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientProfileComponent } from '../../component/patient-profile/patient-profile.component';
import { SharedModule } from 'src/app/layout/shared/shared.module';
import { OrderDetailsComponent } from '../../component/order-details/order-details.component';



@NgModule({
  declarations: [
    PatientProfileComponent,
    OrderDetailsComponent,
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
