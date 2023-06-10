import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { FAQComponent } from '/pages/FAQ/component/faq/faq.component';
import { FAQComponent } from '../../component/faq/faq.component'; 
import { SharedModule } from 'src/app/layout/shared/shared.module';
import { SingleFaqComponent } from '../../component/single-faq/single-faq.component';
import { FAQRoutingModule } from '../../faq-routing.module';

@NgModule({
  declarations: [
    FAQComponent,
    SingleFaqComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FAQRoutingModule
  ],
  exports: [
    FAQComponent,
    SingleFaqComponent
  ]
})
export class FAQModule { }
