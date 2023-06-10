import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { DoctorsComponent } from './doctors.component';
import { DoctorComponent } from './component/doctor/doctor.component';
import { DoctorsComponent } from './component/doctors/doctors.component';

const routes: Routes = [  
    { path: '', component: DoctorsComponent },
    { path: ':name', component: DoctorsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DoctorsRoutingModule { }
