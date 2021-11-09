import { CartItem } from "./cart";

export class CheckOut {
  cartId: string;
  discount:number;
  netTotal:number;
  customerId: string;
  cartItems: CartItem[];
}
