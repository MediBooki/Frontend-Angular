import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpecializationsComponent } from '../../component/specializations/specializations.component';
import { SpecializeComponent } from '../../component/specialize/specialize.component';
import { SharedModule } from 'src/app/layout/shared/shared.module';




@NgModule({
  declarations: [
    SpecializationsComponent,
    SpecializeComponent,
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports:[
    SpecializationsComponent,
    SpecializeComponent,
  ]
})
export class SpecializationsModule { }
