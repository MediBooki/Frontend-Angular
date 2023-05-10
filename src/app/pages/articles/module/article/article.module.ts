import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticlesComponent } from '../../component/articles/articles.component';
import { ArticleComponent } from '../../component/article/article.component'; 
import { SharedModule } from 'src/app/layout/shared/shared.module';

@NgModule({
  declarations: [
    ArticlesComponent,
    ArticleComponent,
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports:[
    ArticlesComponent,
    ArticleComponent,
  ]
})
export class ArticleModule { }
