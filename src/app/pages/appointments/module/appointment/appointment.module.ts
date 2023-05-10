import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentsComponent } from '../../component/appointments.component';
import { SharedModule } from 'src/app/layout/shared/shared.module';
import { DatePipe } from '@angular/common';



@NgModule({
  declarations: [
    AppointmentsComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports:[
    AppointmentsComponent,
    
  ],
  providers: [DatePipe],
})
export class AppointmentModule { }
