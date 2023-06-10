import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentsComponent } from '../../component/appointments.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';

const routes: Routes = [{ path: ':id', component: AppointmentsComponent ,canActivate:[AuthGuard]}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppointmentRoutingRoutingModule { }
