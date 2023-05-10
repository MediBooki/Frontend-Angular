import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from '../../components/register/register.component';
import { LayoutComponent } from '../../components/layout/layout.component';
import { LoginComponent } from '../../components/login/login.component';
import { SharedModule } from 'src/app/layout/shared/shared.module';



@NgModule({
  declarations: [
    LayoutComponent,
    RegisterComponent,
    LoginComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports:[
    LayoutComponent,
    RegisterComponent,
    LoginComponent
  ]
})
export class AuthModule { }
