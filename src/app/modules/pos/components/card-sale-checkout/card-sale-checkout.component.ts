import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';
import { CheckOut } from '../../models/checkOut';
import { CartService } from '../../services/cart.service';
import { CheckoutService } from '../../services/checkout.service';
import { CartItem } from '../../models/cart';
import { Customer } from '../../models/customer/customer.model';

@Component({
  selector: 'app-card-sale-checkout',
  templateUrl: './card-sale-checkout.component.html',
  styleUrls: ['./card-sale-checkout.component.scss'],
})
export class CardSaleCheckoutComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: CheckOut,
    private dialogRef: MatDialogRef<CardSaleCheckoutComponent>,
    public dialog: MatDialog,
    public cartService: CartService,
    private toastr: ToastrService,
    public checkOutService: CheckoutService
  ) {}
  givenAmount: number;
  cartItems: CartItem[];
  cartId: string;
  discount: number;
  netTotal: number;
  paymentAmount: number;
  dueAmount: number;
  customer: Customer;
  isBeingProcessed: boolean = false;
  total: number = 0;
  ngOnInit(): void {
    this.cartId = this.data.cartId;
    this.discount = this.data.discount;
    this.netTotal = this.data.netTotal;
    this.givenAmount = this.data.netTotal;
    this.paymentAmount = this.data.netTotal;
    this.cartItems = this.data.cartItems;
    this.customer = this.cartService.currentCustomer;
    this.cartItems.forEach((arg) => {
      this.total += arg.total;
    });
  }
  submitOrder() {
    this.data.receivedAmount = this.givenAmount;
    this.data.returnAmount = this.givenAmount - this.netTotal;
    this.isBeingProcessed = true;
    this.checkOutService
      .submitOrder(this.data)
      .subscribe((result) => {
        this.toastr.info(result.message);
        //this.cartService.getCustomerCart(this.customer.id);
        this.cartService.clearCartItemsOnly();
        // this.dialog.closeAll();
        this.dialogRef.close(true);
        this.checkOutService
          .getInvoiceReport(result.saleId)
          .subscribe((res) => {
            location.reload();
            const fileURL = URL.createObjectURL(res);
            window.open(fileURL, '_blank');
          });
      })
      .add(() => (this.isBeingProcessed = false));
  }
}
