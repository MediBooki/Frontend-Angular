import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SpecializationsComponent } from './component/specializations/specializations.component';

const routes: Routes = [{ path: '', component: SpecializationsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpecializationsRoutingModule { }
