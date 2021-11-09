export class CartItem {
    id: string;
    productId: string;
    quantity: number;
    productName:string;
    price: number;
    total: number;
    constructor(productId: string, quantity: number, price: number,productName?:string) {
        this.productId = productId;
        this.quantity = quantity;
        this.price = price;
        this.productName=productName;
    }
}