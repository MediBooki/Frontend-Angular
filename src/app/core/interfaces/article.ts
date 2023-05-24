export interface Article {
    created_at:string,
    description:string,
    id:number,
    title:string,
    photo:string,
    section:{
        id:number,
        name:string,
        description:string,
        photo:string
    }
}
