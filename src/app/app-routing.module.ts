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
  { path: 'order/:id', component:OrderDetailsComponent, canActivate:[AuthGuard]},
  { path: 'home', loadChildren: () => import('./pages/home/module/home/home.module').then(m => m.HomeModule) },
  { path: 'appointments', loadChildren: () => import('./pages/appointments/module/appointment/appointment.module').then(m => m.AppointmentModule) },
  { path: 'articles', loadChildren: () => import('./pages/articles/module/article/article.module').then(m => m.ArticleModule) },
  { path: 'auth', loadChildren: () => import('./pages/Auth/module/auth/auth.module').then(m => m.AuthModule) },
  { path: 'cart', loadChildren: () => import('./pages/cart/module/cart/cart.module').then(m => m.CartModule),canActivateChild:[AuthGuard] },
  { path: 'contactus', loadChildren: () => import('./pages/contact-us/module/contact-us.module').then(m => m.ContactUsModule) },
  { path: 'joinus', loadChildren: () => import('./pages/doctor-register/module/doctor-register/doctor-register.module').then(m => m.DoctorRegisterModule) },
  { path: 'doctors', loadChildren: () => import('./pages/doctors/module/doctors.module').then(m => m.DoctorsModule) },
  { path: 'contactus', loadChildren: () => import('./pages/contact-us/module/contact-us.module').then(m => m.ContactUsModule) },
  { path: 'faq', loadChildren: () => import('./pages/FAQ/modules/faq/faq.module').then(m => m.FAQModule) },
  { path: 'my-profile', loadChildren: () => import('./pages/patient-profile/module/patient-profile/patient-profile.module').then(m => m.PatientProfileModule) },
  { path: 'pharmacy', loadChildren: () => import('./pages/pharmacy/module/pharmacy.module').then(m => m.PharmacyModule) },
  { path: 'review', loadChildren: () => import('./pages/review/module/review/review.module').then(m => m.ReviewModule) },
  { path: 'specializations', loadChildren: () => import('./pages/specializations/module/specializations/specializations.module').then(m => m.SpecializationsModule) },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
