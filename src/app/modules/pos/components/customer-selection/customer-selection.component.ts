import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { PaginatedResult } from 'src/app/core/models/wrappers/PaginatedResult';
import { Customer } from '../../models/customer';
import { CustomerParams } from '../../models/customerParams';
import { CustomerRequestModel } from '../../models/customerRequestModel';
import { PosService } from '../../services/pos.service';
@Component({
  selector: 'app-customer-selection',
  templateUrl: './customer-selection.component.html',
  styleUrls: ['./customer-selection.component.scss']
})
export class CustomerSelectionComponent implements OnInit {
  formTitle: string;
  customers: any;
  customerRequestModel = new CustomerRequestModel();
  searchString: string;
  visible = false;
  constructor(public posService: PosService, public dialogRef: MatDialogRef<CustomerSelectionComponent>) { }

  ngOnInit(): void {
    this.formTitle = 'Customer Selection';
    this.customerRequestModel.rowsPerPage = 10;    
    this.getCustomers();

  }
  getCustomers() {
    this.posService.getCustomerList(this.customerRequestModel).subscribe((result) => {
      console.log("csutomer",result)
      if (result) {
        this.customers = result?.data?.item1;
      }
    });
  }
  public doFilter(): void {
    this.customerRequestModel.keyword = this.searchString.trim().toLocaleLowerCase();
    this.getCustomers();
  }
  selectCustomer(customer) {
    this.dialogRef.close(customer);
  }
  closeDialog(){
    this.dialogRef.close();
  }
}
