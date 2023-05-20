import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { FAQComponent } from '/pages/FAQ/component/faq/faq.component';
import { FAQComponent } from '../../component/faq/faq.component'; 
import { SharedModule } from 'src/app/layout/shared/shared.module';


@NgModule({
  declarations: [
    FAQComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    FAQComponent
  ]
})
export class FAQModule { }
