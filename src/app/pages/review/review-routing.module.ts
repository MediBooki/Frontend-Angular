import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReviewComponent } from './component/review/review.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { ReviewGuard } from 'src/app/core/guards/review.guard';


const routes: Routes = [
  { path: ':id', component: ReviewComponent,canActivate:[AuthGuard , ReviewGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReviewRoutingModule { }
