import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpecializationsComponent } from '../../component/specializations/specializations.component';
import { SpecializeComponent } from '../../component/specialize/specialize.component';
import { SpecializeDetailsComponent } from '../../component/specialize-details/specialize-details.component';
import { SharedModule } from 'src/app/layout/shared/shared.module';




@NgModule({
  declarations: [
    SpecializationsComponent,
    SpecializeComponent,
    SpecializeDetailsComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports:[
    SpecializationsComponent,
    SpecializeComponent,
    SpecializeDetailsComponent
  ]
})
export class SpecializationsModule { }
