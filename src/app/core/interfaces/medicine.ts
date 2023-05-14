export interface Medicine {
    id:number,
    name:string,
    description:string,
    price:number,
    manufactured_by:string,
    photo:string,
    category: {
        id: number,
        name: string,
        description: string,
        photo: string
    }
}
