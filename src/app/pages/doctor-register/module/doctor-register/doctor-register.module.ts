import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorRegisterComponent } from '../../component/doctor-register/doctor-register.component';
import { SharedModule } from 'src/app/layout/shared/shared.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { DoctorRegisterRoutingModule } from '../../doctor-register-routing.module';

@NgModule({
  declarations: [
    DoctorRegisterComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgMultiSelectDropDownModule.forRoot(),
    DoctorRegisterRoutingModule

  ],
  exports:[
    DoctorRegisterComponent,
  ]
})
export class DoctorRegisterModule { }
