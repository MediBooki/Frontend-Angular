export interface Medicine {
    id:number,
    name:string,
    description:string,
    price:string,
    manufactured_by:string,
    photo:string,
    category: {
        id: number,
        name: string,
        description: string,
        photo: string
    }
}
