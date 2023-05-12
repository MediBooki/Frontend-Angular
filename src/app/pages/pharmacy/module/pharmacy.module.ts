import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PharmacyComponent } from '../component/pharmacy/pharmacy.component';
import { MedicineDetailsComponent } from '../component/medicine-details/medicine-details.component';
import { SharedModule } from 'src/app/layout/shared/shared.module';
import { NgxSliderModule } from '@angular-slider/ngx-slider';



@NgModule({
  declarations: [
    PharmacyComponent,
    MedicineDetailsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgxSliderModule,

  ],
  exports:[
    PharmacyComponent,
    MedicineDetailsComponent
  ]
})
export class PharmacyModule { }
