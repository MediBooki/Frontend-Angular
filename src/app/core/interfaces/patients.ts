import { Time } from '@angular/common';
import { AppointmentsComponent } from 'src/app/pages/appointments/component/appointments.component';
export interface createAccount {
  email: String;
  password: String;
  name: String;
  date_of_birth: Date;
  phone: String;
  gender: String;
  blood_group: String;
  address: String;
}

export interface Login {
  email: string,
  password: string
}

export interface LoginResponse {
  token: string,
  userId: string
}

export interface AppointmentsPatient {
  patient_id: number,
  doctor_id: number,
  price: number,
  date: Date,
  time: string

}
export interface patientAppointment {
  id: number,
  price: number,
  date: string,
  time: string,
  status: number,
  doctor: {
    id: number,
    name: string,
    specialization: string,
    price: number,
    photo: string,
    start: Time,
    end: Time,
    patient_time_minute: number
  }
}
export interface patientReview{
  doctor_id: number,
  comment: string ,
  rating: number
} 

export interface updatepatientReview{
  id : number
  doctor_id: number,
  comment: string ,
  rating: number
} 

export interface reviews{
  id: number,
  comment: string,
  rating: number,
  doctor: {
      id: number,
      name: string,
      specialization: string,
      price: string,
      photo: string,
      start: string,
      end: string,
      patient_time_minute: number
  }
}
