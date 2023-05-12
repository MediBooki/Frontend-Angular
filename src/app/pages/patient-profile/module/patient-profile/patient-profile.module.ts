import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientProfileComponent } from '../../component/patient-profile/patient-profile.component';
import { SharedModule } from 'src/app/layout/shared/shared.module';



@NgModule({
  declarations: [
    PatientProfileComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports:[
    PatientProfileComponent
  ]
})
export class PatientProfileModule { }
