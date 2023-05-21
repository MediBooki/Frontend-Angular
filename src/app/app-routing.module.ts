import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentsComponent } from './pages/appointments/component/appointments.component';
import { LoginComponent } from './pages/Auth/components/login/login.component';
import { RegisterComponent } from './pages/Auth/components/register/register.component';
import { CartComponent } from './pages/cart/component/cart/cart.component';
import { DoctorsComponent } from './pages/doctors/component/doctors/doctors.component';
import { HomeComponent } from './pages/home/component/Home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { PatientProfileComponent } from './pages/patient-profile/component/patient-profile/patient-profile.component';
import { PharmacyComponent } from './pages/pharmacy/component/pharmacy/pharmacy.component';
import { SpecializationsComponent } from './pages/specializations/component/specializations/specializations.component';
import { MedicineDetailsComponent } from './pages/pharmacy/component/medicine-details/medicine-details.component';
import { DoctorRegisterComponent } from './pages/doctor-register/component/doctor-register/doctor-register.component';
import { CheckoutComponent } from './pages/cart/component/checkout/checkout.component';
import { ReviewComponent } from './pages/review/component/review/review.component';
import { ArticlesComponent } from './pages/articles/component/articles/articles.component';
import { OneArticleComponent } from './pages/articles/component/article-details/one-article.component';
import { ContactUsComponent } from './pages/contact-us/component/contact-us/contact-us.component';
import { SpecializeDetailsComponent } from './pages/specializations/component/specialize-details/specialize-details.component';
import { AuthGuard } from './core/guards/auth.guard';
import { unAuthGuard } from './core/guards/auth.guard';
import { OrderDetailsComponent } from './pages/patient-profile/component/order-details/order-details.component';
import { ForgetPasswordComponent } from './pages/Auth/components/forget-password/forget-password.component';
import { ResetPasswordComponent } from './pages/Auth/components/reset-password/reset-password.component';
import { ReviewGuard } from './core/guards/review.guard';
import { CheckoutGuard } from './core/guards/checkout/checkout.guard';


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
  { path: 'review/:id', component: ReviewComponent,canActivateChild:[AuthGuard],canActivate:[ReviewGuard] },
  { path: 'cart',
   canActivateChild:[AuthGuard],
   children: [
    { path: '', component: CartComponent},
    { path: 'checkout', component: CheckoutComponent, canActivate:[CheckoutGuard]}
  ]},
  { path: 'my-profile', component: PatientProfileComponent,canActivate:[AuthGuard]  },
  { path: 'order/:id', component:OrderDetailsComponent, canActivate:[AuthGuard]},
  {
    path: 'pharmacy', children: [
      { path: '', component: PharmacyComponent },
      { path: 'medicineDetails/:id', component: MedicineDetailsComponent }
    ]
  },
  { path: 'specializations', component: SpecializationsComponent },
  { path : 'specialize/:id' , component:SpecializeDetailsComponent},
  { path: 'Register', component: RegisterComponent, data: { animation: 'Register' },canActivate:[unAuthGuard] },
  { path: 'Login', component: LoginComponent, data: { animation: 'login' },canActivate:[unAuthGuard] },
  { path: 'joinus', component: DoctorRegisterComponent },
  { path: 'articles', component: ArticlesComponent },
  { path: 'article/:id', component: OneArticleComponent },
  { path: 'contactus', component: ContactUsComponent },
  { path:'forgetPassword' , component:ForgetPasswordComponent,canActivate:[unAuthGuard]},
  { path:'ResetPassword' , component:ResetPasswordComponent,canActivate:[unAuthGuard]},
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
