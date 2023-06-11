import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { OrderDetailsComponent } from './pages/patient-profile/component/order-details/order-details.component';
import { AuthGuard } from './core/guards/auth.guard';


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
