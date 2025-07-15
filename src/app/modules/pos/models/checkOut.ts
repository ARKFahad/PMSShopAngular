import { CartItem } from "./cart";

export class CheckOut {
  cartId: string;
  total:number;
  discountInPercentage:number;
  discount:number;
  netTotal:number;
  paymentMethodId: string;
  paymentAmount:number;
  dueAmount:number;
  receivedAmount:number;
  returnAmount:number;
  customerId: string;
  customerAccountId:string
  customername:string;
  customerbalance:number;
  cartItems: CartItem[];
}
