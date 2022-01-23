import { coerceStringArray } from '@angular/cdk/coercion';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PaginatedResult } from 'src/app/core/models/wrappers/PaginatedResult';
import { Customer } from '../../models/customer';
import { CustomerParams } from '../../models/customerParams';
import { CustomerRequestModel } from '../../models/customerRequestModel';
import { CartService } from '../../services/cart.service';
import { PosService } from '../../services/pos.service';
import { CustomerRegisterComponent } from '../customer-register/customer-register.component';
@Component({
  selector: 'app-customer-selection',
  templateUrl: './customer-selection.component.html',
  styleUrls: ['./customer-selection.component.scss']
})
export class CustomerSelectionComponent implements OnInit {
  formTitle: string;
  customers: any[]=[];
  customerRequestModel = new CustomerRequestModel();
  searchString: string;
  visible = false;
  constructor(public posService: PosService, private cartService: CartService,public dialog: MatDialog, public dialogRef: MatDialogRef<CustomerSelectionComponent>) { }

  ngOnInit(): void {
    this.formTitle = 'Customer Selection';
    this.customerRequestModel.rowsPerPage = 10;    
    this.getCustomers();

  }
  getCustomers() {
    this.posService.getCustomerList(this.customerRequestModel).subscribe((result) => {
      console.log(result)
      if (result?.succeeded==true) {
        this.customers = result?.data?.item1;
      }else{
        this.customers=[]
      }
    });
  }
  public doFilter(): void {
    this.customerRequestModel.keyword = this.searchString.trim().toLocaleLowerCase();
    this.getCustomers();
    console.log(this.customers)
  }
  selectCustomer(customer) {
    this.dialogRef.close(customer);
  }
  closeDialog(){
    this.dialogRef.close();
  }
   openCustomerRegisterForm() {
    const dialogRef = this.dialog.open(CustomerRegisterComponent);
     this.dialogRef.close();
    dialogRef.afterClosed().subscribe((customer: Customer) => {
      if (customer) {
       console.log(customer)
       // this.customer = customer;
        this.cartService.setCurrentCustomer(customer);
        this.cartService.getCustomerCart(customer.id);
      }
    });
  }
}
