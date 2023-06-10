import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticlesComponent } from '../../component/articles/articles.component';
import { ArticleComponent } from '../../component/article/article.component'; 
import { OneArticleComponent } from '../../component/article-details/one-article.component';
import { SharedModule } from 'src/app/layout/shared/shared.module';
import { ArticlesRoutingModule } from '../../articles-routing.module';

@NgModule({
  declarations: [
    ArticlesComponent,
    ArticleComponent,
    OneArticleComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ArticlesRoutingModule
  ],
  exports:[
    ArticlesComponent,
    ArticleComponent,
    OneArticleComponent
  ]
})
export class ArticleModule { }
