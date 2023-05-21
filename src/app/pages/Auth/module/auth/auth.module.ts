import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from '../../components/register/register.component';
import { LayoutComponent } from '../../components/layout/layout.component';
import { LoginComponent } from '../../components/login/login.component';
import { SharedModule } from 'src/app/layout/shared/shared.module';
import { ForgetPasswordComponent } from '../../components/forget-password/forget-password.component';
import { ResetPasswordComponent } from '../../components/reset-password/reset-password.component';


@NgModule({
  declarations: [
    LayoutComponent,
    RegisterComponent,
    LoginComponent,
    ForgetPasswordComponent,
    ResetPasswordComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports:[
    LayoutComponent,
    RegisterComponent,
    LoginComponent,
    ForgetPasswordComponent,
    ResetPasswordComponent
  ]
})
export class AuthModule { }
