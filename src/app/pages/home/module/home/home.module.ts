import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from '../../component/Home/home.component';
import { SharedModule } from 'src/app/layout/shared/shared.module';



@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports:[
    HomeComponent
  ]
})
export class HomeModule { }
