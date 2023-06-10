import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewComponent } from '../../component/review/review.component';
import { SharedModule } from 'src/app/layout/shared/shared.module';
import { NgxStarRatingModule } from 'ngx-star-rating';//review
import { ReviewRoutingModule } from '../../review-routing.module';


@NgModule({
  declarations: [
    ReviewComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgxStarRatingModule,
    ReviewRoutingModule
  ],
  exports:[
    ReviewComponent
  ]
})
export class ReviewModule { }
