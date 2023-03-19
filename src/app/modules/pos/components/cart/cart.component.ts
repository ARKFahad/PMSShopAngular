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
import { DiscountPercentageComponent } from '../discount-percentage/discount-percentage.component';
import { DiscountComponent } from '../discount/discount.component';
import { PaymentComponent } from '../payment/payment.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  @Input() cart: MatSidenav;
  cartItems: CartItem[];
  total: number = 0;
  netTotal: number = 0;
  netTotalAfterRound: number = 0;
  discountInPercentage: number = 0;
  discount: number = 0;
  paymentAmount: number = 0;
  dueAmount: number = 0;
  constructor(
    public cartService: CartService,
    private toastr: ToastrService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadCurrentCart();
    this.cartService.get().subscribe((data) => {
      console.log(data);
      this.total = 0;
      this.cartItems = data;
      data.forEach((arg) => {
        this.total += arg.total;
      });
      this.netTotal = this.total - this.discount;
      this.netTotalAfterRound = Math.round(this.netTotal);
    });
  }
  loadCurrentCart() {
    this.cartItems = this.cartService.loadCurrentCart();
    this.cartItems.forEach((arg) => {
      this.total += arg.total;
    });
    this.netTotal = this.total;
    this.netTotalAfterRound = Math.round(this.total);
  }
  increaseQuantity(productId, productStockQuantity) {
    this.discount = 0;
    this.cartService.increase(productId, productStockQuantity);
  }
  reduceQuantity(productId, productStockQuantity) {
    this.discount = 0;
    this.cartService.reduce(productId, productStockQuantity);
  }
  removeItem(productId) {
    this.discount = 0;
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
    checkOutData.total = this.total;
    checkOutData.discountInPercentage = this.discountInPercentage;
    checkOutData.discount = this.discount;
    checkOutData.netTotal = this.netTotalAfterRound;
    checkOutData.paymentAmount = this.netTotalAfterRound;
    checkOutData.dueAmount = 0;
    checkOutData.cartItems = this.cartItems;
    checkOutData.customerId = this.cartService.currentCustomer.id;
    const dialogRef = this.dialog.open(CheckoutComponent, {
      data: checkOutData,
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  openCreditSaleCheckoutDialog() {
    var checkOutData = new CheckOut();
    checkOutData.cartId = this.cartService.cartId;
    checkOutData.total = this.total;
    checkOutData.discount = this.discount;
    checkOutData.netTotal = this.netTotalAfterRound;
    checkOutData.paymentAmount = 0;
    checkOutData.dueAmount = this.netTotalAfterRound;
    checkOutData.cartItems = this.cartItems;
    checkOutData.customerId = this.cartService.currentCustomer.id;
    checkOutData.customername = this.cartService.currentCustomer.name;
    checkOutData.customerAccountId = this.cartService.currentCustomer.accountId;
    checkOutData.customerbalance = this.cartService.currentCustomer.balance;
    if (
      this.cartService.currentCustomer.id ==
      '8156b38d-8724-4a18-8116-303bcf408701'
    ) {
      alert('Please Switch Cash Customer to Another Customer!!!!');
    } else {
      const dialogRef = this.dialog.open(CreditSaleCheckoutComponent, {
        data: checkOutData,
      });
      dialogRef.afterClosed().subscribe((result) => {});
    }
  }
  openClearCartDialog() {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: 'Do you want to clear this cart?',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.cartService.clearCart();
        this.discount = 0;
      }
    });
  }

  openDiscountDialog() {
    const dialogRef = this.dialog.open(DiscountComponent, {
      data: '',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.discountInPercentage = (result?.discount * 100) / this.total;
        this.discount = result?.discount;
        this.netTotal = this.total - result?.discount;
        this.netTotalAfterRound = Math.round(this.netTotal);
      }
    });
  }
  openDiscountPercentageDialog() {
    const dialogRef = this.dialog.open(DiscountPercentageComponent, {
      data: '',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.discountInPercentage = result?.discount;
        var percentageDiscount = (result?.discount * this.total) / 100;
        this.discount = percentageDiscount;
        this.netTotal = this.total - percentageDiscount;
        this.netTotalAfterRound = Math.round(this.netTotal);
      }
    });
  }

  onChangeQuantity(item) {
    // var num1 = item?.quantity.match(/^\d+$/);
    // if(num1===null) item.quantity=""
    //  var num2 = item?.price.match(/^\d+(\.\d+)*$/);
    // if (num2 === null)  item.price=""
    this.discount = 0;
    this.cartService.onChangeQuantity(item);
  }
}
