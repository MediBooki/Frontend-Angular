import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { AuthComponent } from './auth.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { unAuthGuard } from 'src/app/core/guards/auth.guard';
import { ResetPasswordGuard } from 'src/app/core/guards/resetPass/reset-password.guard';

const routes: Routes = [
  { path: 'Register', component: RegisterComponent, data: { animation: 'Register' },canActivate:[unAuthGuard] },
  { path: 'Login', component: LoginComponent, data: { animation: 'login' },canActivate:[unAuthGuard] },
  { path:'forgetPassword' , component:ForgetPasswordComponent,canActivate:[unAuthGuard]},
  { path:'ResetPassword' , component:ResetPasswordComponent,canActivate:[unAuthGuard,ResetPasswordGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
