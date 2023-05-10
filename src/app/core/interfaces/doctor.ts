import { Time } from "@angular/common";

export interface Doctor {
    id:number,
    name:string,
    specialization:string,
    price:string,
    photo:string,
    start:Time,
    end:Time,
    education: string,
    experience: string,
    patient_time_minute:number,
    section:{
        id:number,
        name:string,
        description:string,
        photo:string
    },
    appointments:[{
        id:number,
        name:string
    }],
    reviews:[{
        id:number,
        comment:string,
        rating:number
    }]
}

export interface reviewDoctor {
    id: number,
    comment: string,
    rating: number,
    created_at: string,
    updated_at: string,
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
