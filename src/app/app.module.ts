import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';1
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { SharedModule } from './layout/shared/shared.module';
import { PharmacyModule } from './pages/pharmacy/module/pharmacy.module';
import { DoctorsModule } from './pages/doctors/module/doctors.module';
import { ArticleModule } from './pages/articles/module/article/article.module';
import { AppointmentModule } from './pages/appointments/module/appointment/appointment.module';
import { AuthModule } from './pages/Auth/module/auth/auth.module';
import { CartModule } from './pages/cart/module/cart/cart.module';
import { DoctorRegisterModule } from './pages/doctor-register/module/doctor-register/doctor-register.module';
import { PatientProfileModule } from './pages/patient-profile/module/patient-profile/patient-profile.module';
import { ReviewModule } from './pages/review/module/review/review.module';
import { SpecializationsModule } from './pages/specializations/module/specializations/specializations.module';
import { HomeModule } from './pages/home/module/home/home.module';
import { FAQModule } from './pages/FAQ/modules/faq/faq.module';


@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    PharmacyModule,
    DoctorsModule,
    ArticleModule,
    AppointmentModule,
    AuthModule,
    CartModule,
    DoctorRegisterModule,
    PatientProfileModule,
    ReviewModule,
    SpecializationsModule,
    HomeModule,
    FAQModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

// "node_modules/bootstrap/dist/css/bootstrap.rtl.min.css",


