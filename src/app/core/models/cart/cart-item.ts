export class CartItemApiModel {
    id: string;
    cartId: string;
    productId: string;
    quantity: number;
    price: number;
    productName:string;
    
   
    constructor(cartId: string, productId: string, quantity: number,price?:number,productName?:string) {
        this.cartId = cartId;
        this.productId = productId;
        this.quantity = quantity;
        this.price=price
        this.productName=productName;
    }

}