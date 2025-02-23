export interface ProductModal{
  _id:string,
  name: string,
  slug: string,
  description: string,
  price: number,
  category: string[],
  stock: number,
  imageUrl: string[],
  createdAt: string
  updatedAt: string
  isActive: boolean
}
