import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorComponent } from '../component/doctor/doctor.component';
import { DoctorsComponent } from '../component/doctors/doctors.component';
import { SharedModule } from 'src/app/layout/shared/shared.module';



@NgModule({
  declarations: [
    DoctorsComponent,
    DoctorComponent,
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports:[
    DoctorComponent,
    DoctorsComponent
  ]
})
export class DoctorsModule { }
