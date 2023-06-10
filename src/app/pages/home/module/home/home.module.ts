import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from '../../component/Home/home.component';
import { SharedModule } from 'src/app/layout/shared/shared.module';
import { ArticleModule } from 'src/app/pages/articles/module/article/article.module';
import { HomeRoutingModule } from '../../home-routing.module';

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    ArticleModule,
  ],
  exports:[
    HomeComponent
  ]
})
export class HomeModule { }
