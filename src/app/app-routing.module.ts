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
import { OrderDetailsComponent } from './pages/patient-profile/component/order-details/order-details.component';
import { ForgetPasswordComponent } from './pages/Auth/components/forget-password/forget-password.component';
import { ResetPasswordComponent } from './pages/Auth/components/reset-password/reset-password.component';
import { FAQComponent } from './pages/FAQ/component/faq/faq.component';
import { AuthGuard } from './core/guards/auth.guard';
import { unAuthGuard } from './core/guards/auth.guard';
import { ReviewGuard } from './core/guards/review.guard';
import { CheckoutGuard } from './core/guards/checkout/checkout.guard';
import { ResetPasswordGuard } from './core/guards/resetPass/reset-password.guard';
import { ProfileDetailsComponent } from './pages/patient-profile/component/profile-details/profile-details.component';
import { ChangePasswordComponent } from './pages/patient-profile/component/change-password/change-password.component';
import { MyInsuranceComponent } from './pages/patient-profile/component/my-insurance/my-insurance.component';
import { MyAppointmentsComponent } from './pages/patient-profile/component/my-appointments/my-appointments.component';
import { HistoryComponent } from './pages/patient-profile/component/history/history.component';
import { InvoicesComponent } from './pages/patient-profile/component/invoices/invoices.component';
import { FavoritesComponent } from './pages/patient-profile/component/favorites/favorites.component';
import { OrdersComponent } from './pages/patient-profile/component/orders/orders.component';
import { ReviewsComponent } from './pages/patient-profile/component/reviews/reviews.component';

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
  {
    path: 'my-profile', component: PatientProfileComponent,children: [
      { path: '', redirectTo: 'details', pathMatch: 'full' },
      { path: 'details', component: ProfileDetailsComponent, canActivate:[AuthGuard]},
      { path: 'change-password', component: ChangePasswordComponent, canActivate:[AuthGuard]},
      { path: 'insurance', component: MyInsuranceComponent, canActivate:[AuthGuard]},
      { path: 'appointments', component: MyAppointmentsComponent, canActivate:[AuthGuard]},
      { path: 'history', component: HistoryComponent, canActivate:[AuthGuard]},
      { path: 'invoices', component: InvoicesComponent, canActivate:[AuthGuard]},
      { path: 'favorites', component: FavoritesComponent, canActivate:[AuthGuard]},
      { path: 'orders', component: OrdersComponent, canActivate:[AuthGuard]},
      { path: 'reviews', component: ReviewsComponent, canActivate:[AuthGuard]}
  ] ,canActivate:[AuthGuard]  },
  { path: 'order/:id', component:OrderDetailsComponent, canActivate:[AuthGuard]},
  {
    path: 'pharmacy', children: [
      { path: '', component: PharmacyComponent },
      { path: 'medicineDetails/:id', component: MedicineDetailsComponent }
    ]
  },
  { path: 'specializations', component: SpecializationsComponent },
  { path: 'Register', component: RegisterComponent, data: { animation: 'Register' },canActivate:[unAuthGuard] },
  { path: 'Login', component: LoginComponent, data: { animation: 'login' },canActivate:[unAuthGuard] },
  { path: 'joinus', component: DoctorRegisterComponent },
  { path: 'articles', component: ArticlesComponent },
  { path: 'article/:id', component: OneArticleComponent },
  { path: 'contactus', component: ContactUsComponent },
  { path: 'faq', component: FAQComponent },
  { path:'forgetPassword' , component:ForgetPasswordComponent,canActivate:[unAuthGuard]},
  { path:'ResetPassword' , component:ResetPasswordComponent,canActivate:[unAuthGuard,ResetPasswordGuard]},
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
