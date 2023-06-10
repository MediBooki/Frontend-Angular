import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// import { ContactUsRoutingModule } from './contact-us-routing.module';
import { ContactUsRoutingModule } from '../contact-us-routing.module';
import { SharedModule } from 'src/app/layout/shared/shared.module';
import { ContactUsComponent } from '../component/contact-us/contact-us.component';


@NgModule({
  declarations: [
    ContactUsComponent
  ],
  imports: [
    CommonModule,
    ContactUsRoutingModule,
    SharedModule
  ],
  exports:[
    ContactUsComponent
  ]
})
export class ContactUsModule { }
