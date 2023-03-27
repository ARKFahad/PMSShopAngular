import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/services/auth.service';
import { environment } from 'src/environments/environment';
import { CartItem } from '../../models/cart';
import { CheckOut } from '../../models/checkOut';
import { Customer } from '../../models/customer/customer.model';
import { CartService } from '../../services/cart.service';
import { CheckoutService } from '../../services/checkout.service';

@Component({
  selector: 'app-credit-sale-checkout',
  templateUrl: './credit-sale-checkout.component.html',
  styleUrls: ['./credit-sale-checkout.component.scss'],
})
export class CreditSaleCheckoutComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: CheckOut,
    public dialog: MatDialog,
    public cartService: CartService,
    private toastr: ToastrService,
    public checkOutService: CheckoutService,
    private http: HttpClient,
    private authService: AuthService
  ) {}
  givenAmount: number = 0;
  cartItems: CartItem[];
  cartId: string;
  discount: number;
  netTotal: number;
  paymentAmount: number;
  dueAmount: number;
  customer: Customer;
  customername: string;
  customerbalance: number;
  isBeingProcessed: boolean = false;
  total: number = 0;
  ngOnInit(): void {
    this.cartId = this.data.cartId;
    this.discount = this.data.discount;
    this.netTotal = this.data.netTotal;
    this.dueAmount = this.data.netTotal;
    this.cartItems = this.data.cartItems;
    this.customer = this.cartService.currentCustomer;
    this.customername = this.data.customername;
    // this.customerbalance=this.data.customerbalance;
    this.cartItems.forEach((arg) => {
      this.total += arg.total;
    });
    this.getCustomerBalance();
  }
  getCustomerBalance() {
    this.http
      .get<any>(
        environment.apiUrl +
          'account/balance/' +
          this.data?.customerAccountId +
          '/1/' +
          this.authService.getBranchId
      )
      .subscribe((res) => {
        this.customerbalance = res?.balance;
      });
  }
  submitOrder() {
    this.isBeingProcessed = true;
    this.checkOutService
      .submitOrder(this.data)
      .subscribe((result) => {
        this.toastr.info(result.message);
        this.cartService.getCustomerCart(this.customer.id);
        this.dialog.closeAll();
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
