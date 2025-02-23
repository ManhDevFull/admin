export interface VariantModel {
    description: string,
    stock: number,
    price: number,
    imgURL: string[],
    _id: string,
    variantArray: VariantItem[]
}
export interface VariantItem {
    label: string,
    value: string,
}