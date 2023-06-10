import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { PharmacyComponent } from './pharmacy.component';
import { PharmacyComponent } from './component/pharmacy/pharmacy.component';
import { MedicineDetailsComponent } from './component/medicine-details/medicine-details.component';

const routes: Routes = [
  { path: '', component: PharmacyComponent },
  { path: 'medicineDetails/:id', component: MedicineDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PharmacyRoutingModule { }
