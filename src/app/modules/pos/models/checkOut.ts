import { CartItem } from "./cart";

export class CheckOut {
  cartId: string;
  total:number;
  discount:number;
  netTotal:number;
  paymentAmount:number;
  dueAmount:number;
  customerId: string;
  customername:string;
  customerbalance:number;
  cartItems: CartItem[];
}
