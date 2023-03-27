import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/services/auth.service';
import { environment } from 'src/environments/environment';
import { Customer } from '../../models/customer/customer.model';
import { CustomerRequest } from '../../models/customer/customerRequest.model';
import { CartService } from '../../services/cart.service';
import { CustomerService } from '../../services/customer.service';
import { CustomerRegisterComponent } from '../customer-register/customer-register.component';
import { PaymentComponent } from '../payment/payment.component';
@Component({
  selector: 'app-customer-selection',
  templateUrl: './customer-selection.component.html',
  styleUrls: ['./customer-selection.component.scss'],
})
export class CustomerSelectionComponent implements OnInit {
  formTitle: string;
  customers: Customer[] = [];
  customerRequestModel = new CustomerRequest();
  searchString: string;
  visible = false;
  constructor(
    public customerService: CustomerService,
    private cartService: CartService,
    private http: HttpClient,
    private toastr: ToastrService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<CustomerSelectionComponent>,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.formTitle = 'Customer Selection';
    this.customerRequestModel.rowsPerPage = 10;
    this.getCustomers();
  }

  getCustomers() {
    this.customerRequestModel.branchId = this.authService.getBranchId;
    this.customerService
      .getCustomerList(this.customerRequestModel)
      .subscribe((result) => {
        console.log(result);
        if (result?.succeeded == true) {
          this.customers = result?.data?.item1;
        } else {
          this.customers = [];
        }
      });
  }
  public doFilter(): void {
    this.customerRequestModel.keyword = this.searchString
      .trim()
      .toLocaleLowerCase();
    this.getCustomers();
    console.log(this.customers);
  }
  selectCustomer(customer) {
    this.dialogRef.close(customer);
  }
  closeDialog() {
    this.dialogRef.close();
  }
  openPaymentDialog(customer) {
    const dialogRef = this.dialog.open(PaymentComponent, {
      data: customer,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.http
          .post<any>(environment.apiUrl + 'CustomerPayment', result)
          .subscribe((res) => {
            this.toastr.success(res?.message);
            this.dialog.closeAll();
          });
      }
    });
  }

  openCustomerRegisterForm(searchString: string) {
    const dialogRef = this.dialog.open(CustomerRegisterComponent, {
      data: { name: searchString },
    });
    this.dialogRef.close();
    dialogRef.afterClosed().subscribe((customer: Customer) => {
      if (customer) {
        console.log(customer);
        // this.customer = customer;
        this.cartService.setCurrentCustomer(customer);
        this.cartService.getCustomerCart(customer.id);
      }
    });
  }
}
