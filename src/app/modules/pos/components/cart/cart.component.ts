import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { ToastrService } from 'ngx-toastr';
import { DeleteDialogComponent } from 'src/app/core/shared/components/delete-dialog/delete-dialog.component';
import { CartItem } from '../../models/cart';
import { CheckOut } from '../../models/checkOut';
import { CartService } from '../../services/cart.service';
import { CashPaymentComponent } from '../cash-payment/cash-payment.component';
import { CheckoutComponent } from '../checkout/checkout.component';
import { CreditSaleCheckoutComponent } from '../credit-sale-checkout/credit-sale-checkout.component';
import { DiscountComponent } from '../discount/discount.component';
import { PaymentComponent } from '../payment/payment.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  @Input() cart: MatSidenav;
  cartItems: CartItem[];
  total: number = 0;
  netTotal: number = 0;
  discount:number=0;
  paymentAmount:number=0;
  dueAmount:number=0
  constructor(public cartService: CartService, private toastr: ToastrService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadCurrentCart();
    this.cartService.get().subscribe((data) => {
      console.log(data)
      this.total = 0;
      this.cartItems = data;
      data.forEach(arg => {
        this.total += arg.total;
      });
      this.netTotal=this.total
    });
  }
  loadCurrentCart() {
    this.cartItems = this.cartService.loadCurrentCart();
    this.cartItems.forEach(arg => {
      this.total += arg.total;
    });
     this.netTotal=this.total
  }
  increaseQuantity(productId,productStockQuantity) {
    console.log(productStockQuantity)
    this.cartService.increase(productId,productStockQuantity);
  }
  reduceQuantity(productId,productStockQuantity) {
    this.cartService.reduce(productId,productStockQuantity);
  }
  removeItem(productId) {
    this.cartService.remove(productId);
  }
  isCustomerSelected() {
    const currentCustomer = this.cartService.getCurrentCustomer();
    if (!currentCustomer) {
      this.toastr.info('Select a customer first');
      return false;
    }
    return true;
  }
  saveOrUpdateCart() {
    if (this.isCustomerSelected()) {
      const customerId = this.cartService.getCurrentCustomer();
      const cart = this.cartService.loadCurrentCart();
    }
  }

  openCheckoutDialog() {
    var checkOutData = new CheckOut();
    checkOutData.cartId = this.cartService.cartId;
    checkOutData.total=this.total;
    checkOutData.discount=this.discount;
    checkOutData.netTotal=this.netTotal;
    checkOutData.paymentAmount=this.paymentAmount;
    checkOutData.dueAmount=this.dueAmount;
    checkOutData.cartItems = this.cartItems;
    checkOutData.customerId = this.cartService.currentCustomer.id;
    const dialogRef = this.dialog.open(CheckoutComponent, {
      data: checkOutData,
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

   openCreditSaleCheckoutDialog() {
    var checkOutData = new CheckOut();
    checkOutData.cartId = this.cartService.cartId;
    checkOutData.total=this.total;
    checkOutData.discount=this.discount;
    checkOutData.netTotal=this.netTotal;
    checkOutData.paymentAmount=this.paymentAmount;
    checkOutData.dueAmount=this.dueAmount;
    checkOutData.cartItems = this.cartItems;
    checkOutData.customerId = this.cartService.currentCustomer.id;
    checkOutData.customername=this.cartService.currentCustomer.name;
    checkOutData.customerbalance=this.cartService.currentCustomer.balance;
    const dialogRef = this.dialog.open(CreditSaleCheckoutComponent, {
      data: checkOutData,
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  openClearCartDialog() {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: 'Do you want to clear this cart?',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.cartService.clearCart();
      }
    });
  }

  openDiscountDialog() {
    const dialogRef = this.dialog.open(DiscountComponent, {
      data: '',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.discount=result?.discount
        this.netTotal-=result?.discount
        
      }
    });
  }
  openPaymentDialog() {
    const dialogRef = this.dialog.open(PaymentComponent, {
      data: '',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.paymentAmount=result?.paymentAmount
        this.dueAmount=this.netTotal-this.paymentAmount
      }
    });
  }

   openCashPaymentDialog() {
    const dialogRef = this.dialog.open(CashPaymentComponent, {
      data: this.netTotal,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.paymentAmount=result?.paymentAmount
        this.dueAmount=this.netTotal-this.paymentAmount
      }
    });
  }

  onChangeQuantity(item){
    // var num1 = item?.quantity.match(/^\d+$/);
    // if(num1===null) item.quantity=""
    //  var num2 = item?.price.match(/^\d+(\.\d+)*$/);
    // if (num2 === null)  item.price=""
   
    this.cartService.onChangeQuantity(item);
  }
}
