import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Customer } from 'src/app/modules/admin/people/models/customer';
import { CartItem } from '../../models/cart';
import { CheckOut } from '../../models/checkOut';
import { CartService } from '../../services/cart.service';
import { CheckoutService } from '../../services/checkout.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: CheckOut, public dialog: MatDialog, public cartService: CartService,private toastr: ToastrService, public checkOutService: CheckoutService) { }
  cartItems: CartItem[];
  cartId: string;
  discount:number;
  netTotal:number;
  customer: Customer;
  isBeingProcessed: boolean = false;
  total: number = 0;
  ngOnInit(): void {
    this.cartId = this.data.cartId;
    this.discount=this.data.discount;
    this.netTotal=this.data.netTotal;
    this.cartItems = this.data.cartItems;
    this.customer = this.cartService.currentCustomer;
    this.cartItems.forEach(arg => {
      this.total += arg.total;
    });
  }
  submitOrder() {
    this.isBeingProcessed = true;
    this.checkOutService.submitOrder(this.cartId,this.discount).subscribe((result) => {
      console.log("submit sale",result)
      if(result?.saleId.length>2){
         this.toastr.info('Sale Added Successfully');
      }else{
          this.toastr.info('Something went wrong');
      }
     
      this.cartService.reset();
      this.dialog.closeAll();
    }).add(() => this.isBeingProcessed = false);
  }
}
