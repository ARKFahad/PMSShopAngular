import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { CartItem } from '../models/cart';
import { Customer } from '../models/customer';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems$ = new Subject<CartItem[]>();
  private cartItems: CartItem[] = [];
  public currentCustomer: Customer;
  public currentCustomer$ = new Subject<Customer>();
  public cartId: string;
  public isCartLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isCartInvalid: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public IsProductBeingAdded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor( private toastr: ToastrService) { }
  
 
  clearCart()
  {
    var cartId = this.cartId;
      this.cartItems = [];
      this.cartItems$.next(this.cartItems);
  }
  reset() {
    this.cartItems = [];
    this.cartItems$.next(this.cartItems);
    this.currentCustomer = null;
    this.currentCustomer$.next(this.currentCustomer);
    this.cartId = null;
    this.isCartInvalid.next(true);
  }
   
  add(product: any, quantity: number = 1) {
    if (!this.cartId) { return; }

    this.IsProductBeingAdded.next(true);
    var foundItem = this.cartItems.find(a => a.productId == product.productId);
    if (foundItem) {
      //check stock
      if(foundItem.quantity>=product.quantity) {
         this.toastr.error('Stock Exceeded !!!', '', {
            positionClass: 'toast-top-right'
          });
      }else{
       foundItem.quantity = foundItem.quantity + quantity;
      }
     
    }
    else {
      this.cartItems.push(new CartItem(product.productId, quantity ?? 1, product.mrp,product.productName,product.productPackSize,product.quantity));
          this.toastr.info('Product Added to Cart', '', {
            positionClass: 'toast-top-right'
          });
    }
    this.cartItems$.next(this.calculate(this.cartItems));


  }
  increase(productId: string,productStockQuantity:number, quantity: number = 1) {
    if (!this.cartId) { return; }
    var foundItem = this.cartItems.find(a => a.productId == productId);
    if (foundItem) {
       //check stock
      if(foundItem.quantity>=productStockQuantity) {
         this.toastr.error('Stock Exceeded !!!', '', {
            positionClass: 'toast-top-right'
          });
      }else{
      foundItem.quantity = foundItem.quantity + quantity;
      }
    }
    this.cartItems$.next(this.calculate(this.cartItems));
  }

   onChangeQuantity(item) {
    if (!this.cartId) { return; }
    var foundItem = this.cartItems.find(a => a.productId == item.productId);
    if (foundItem) {
       //check stock
      if(foundItem.quantity>item.productStockQuantity) {
         this.toastr.error('Stock Exceeded !!!', '', {
            positionClass: 'toast-top-right'
          });
          foundItem.quantity = item.productStockQuantity;
      }else{
      foundItem.quantity = foundItem.quantity;
      }
    }
    this.cartItems$.next(this.calculate(this.cartItems));
  }


  reduce(productId: string,productStockQuantity:number, quantity: number = 1) {
    var foundItem = this.cartItems.find(a => a.productId == productId);
    if (!this.cartId) { return; }
    if (foundItem) {
      if (foundItem.quantity > 1) {
        foundItem.quantity = foundItem.quantity - quantity;
      }
      else {
        this.cartItems.splice(this.cartItems.indexOf(foundItem), 1);
      }
    }
    this.cartItems$.next(this.calculate(this.cartItems));
  }

  remove(productId: string) {
    if (!this.cartId) { return; }
    var foundItem = this.cartItems.find(a => a.productId == productId);
    if (foundItem) {
      this.cartItems.splice(this.cartItems.indexOf(foundItem), 1);
    }
    this.cartItems$.next(this.cartItems);
  }
  get(): Observable<CartItem[]> {
    return this.cartItems$.asObservable();
  }
  loadCurrentCart(): CartItem[] {
    return this.calculate(this.cartItems);
  }
  setCurrentCustomer(customer: Customer) {
    this.currentCustomer = customer;
    this.currentCustomer$.next(this.currentCustomer);
    this.isCartInvalid.next(false);
  }
  getCurrentCustomer() {
    return this.currentCustomer$.asObservable();
  }
  private calculate(cartItems: CartItem[]): CartItem[] {
    cartItems.forEach(function (part, index, theArray) {
      theArray[index].total = cartItems[index].quantity * cartItems[index].price;
    });
    return cartItems;
  }
  getCustomerCart(customerId: string) {
    this.cartItems = [];
    this.cartId="fdfdfdf"
    this.isCartLoading.next(false);
    this.cartItems$.next(this.calculate(this.cartItems));
  }
}
