import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';1
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { SpecializationsComponent } from './pages/specializations/specializations.component';
import { PatientProfileComponent } from './pages/patient-profile/patient-profile.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NotFoundComponent } from './pages/not-found/not-found.component';

import { ReviewComponent } from './pages/review/review.component';
import { NgxStarRatingModule } from 'ngx-star-rating';//review
import { OneArticleComponent } from './pages/one-article/one-article.component';
import { SharedModule } from './layout/shared/shared.module';
import { PharmacyModule } from './pages/pharmacy/module/pharmacy.module';
import { DoctorsModule } from './pages/doctors/module/doctors.module';
import { ArticleModule } from './pages/articles/module/article/article.module';
import { AppointmentModule } from './pages/appointments/module/appointment/appointment.module';
import { AuthModule } from './pages/Auth/module/auth/auth.module';
import { CartModule } from './pages/cart/module/cart/cart.module';
import { ContactUsModule } from './pages/contact-us/module/contact-us/contact-us.module';
import { DoctorRegisterModule } from './pages/doctor-register/module/doctor-register/doctor-register.module';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SpecializationsComponent,
    PatientProfileComponent,
    NotFoundComponent,
    ReviewComponent,
    OneArticleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgxStarRatingModule,
    SharedModule,
    PharmacyModule,
    DoctorsModule,
    ArticleModule,
    AppointmentModule,
    AuthModule,
    CartModule,
    ContactUsModule,
    DoctorRegisterModule
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }


