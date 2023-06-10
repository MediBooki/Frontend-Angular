import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { ArticlesComponent } from './articles.component';
import { ArticlesComponent } from './component/articles/articles.component';
import { ArticleComponent } from './component/article/article.component';
import { OneArticleComponent } from './component/article-details/one-article.component';

const routes: Routes = [
  { path: '', component: ArticlesComponent },
  { path: 'article/:id', component: OneArticleComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticlesRoutingModule { }
