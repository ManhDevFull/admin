export interface OrderModal {
  orderNumber: string;
  customer: string,
  shippingAddress: shipAr,
  products: productItem[];
  totalAmount: number;
  status: string;
  orderDate: string;
  deliveryDate: string;
  paymentMethod: string;
  notes: string;
}
export interface productItem {
  productId: string;
  quantity: number;
  price: number;
}
export interface shipAr{
  name: string,
  address: string,
  phone: number
}
