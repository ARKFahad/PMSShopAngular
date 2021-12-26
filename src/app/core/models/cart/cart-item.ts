export class CartItemApiModel {
    id: string;
    cartId: string;
    productId: string;
    quantity: number;
    price: number;
    productName:string;
    productStockQuantity:number
   
    constructor(cartId: string, productId: string, quantity: number,price?:number,productName?:string,productStockQuantity?:number) {
        this.cartId = cartId;
        this.productId = productId;
        this.quantity = quantity;
        this.price=price
        this.productName=productName;
        this.productStockQuantity=productStockQuantity;
    }

}