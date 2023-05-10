import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentsComponent } from './pages/appointments/component/appointments.component';
import { LoginComponent } from './pages/Auth/components/login/login.component';
import { RegisterComponent } from './pages/Auth/components/register/register.component';
import { CartComponent } from './pages/cart/component/cart/cart.component';
import { DoctorsComponent } from './pages/doctors/doctors.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { PatientProfileComponent } from './pages/patient-profile/patient-profile.component';
import { PharmacyComponent } from './pages/pharmacy/pharmacy.component';
import { SpecializationsComponent } from './pages/specializations/specializations.component';
import { MedicineDetailsComponent } from './pages/pharmacy/medicine-details/medicine-details.component';
import { DoctorRegisterComponent } from './pages/doctor-register/component/doctor-register/doctor-register.component';
import { CheckoutComponent } from './pages/cart/component/checkout/checkout.component';
import { CheckoutSuccessComponent } from './pages/cart/component/checkout-success/checkout-success.component';
import { ReviewComponent } from './pages/review/review.component';
import { ArticlesComponent } from './pages/articles/component/articles/articles.component';
import { OneArticleComponent } from './pages/one-article/one-article.component';
import { ContactUsComponent } from './pages/contact-us/component/contact-us/contact-us.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  {
    path: 'doctors', children: [
      { path: '', component: DoctorsComponent },
      { path: ':name', component: DoctorsComponent }
    ]
  },
  { path: 'appointments/:id', component: AppointmentsComponent },
  { path: 'review/:id', component: ReviewComponent },
  { path: 'cart', children: [
    { path: '', component: CartComponent },
    { path: 'checkout', children: [
      { path: '', component: CheckoutComponent },
      { path: 'checkout-success', component: CheckoutSuccessComponent }
    ] }
  ] },
  { path: 'my-profile', component: PatientProfileComponent },
  {
    path: 'pharmacy', children: [
      { path: '', component: PharmacyComponent },
      { path: 'medicineDetails/:id', component: MedicineDetailsComponent }
    ]
  },
  { path: 'specializations', component: SpecializationsComponent },
  { path: 'Register', component: RegisterComponent, data: { animation: 'Register' } },
  { path: 'Login', component: LoginComponent, data: { animation: 'login' } },
  { path: 'joinus', component: DoctorRegisterComponent },
  { path: 'articles', component: ArticlesComponent },
  { path: 'article/:id', component: OneArticleComponent },
  { path: 'contactus', component: ContactUsComponent },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
