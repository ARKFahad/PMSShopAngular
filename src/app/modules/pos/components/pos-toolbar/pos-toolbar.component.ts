import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from 'src/app/core/services/auth.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { ThemeService } from 'src/app/core/services/theme.service';
import { CustomerService } from 'src/app/modules/admin/people/services/customer.service';
import { environment } from 'src/environments/environment';
import { Customer } from '../../models/customer';
import { CartService } from '../../services/cart.service';
import { PosService } from '../../services/pos.service';
import { CustomerSelectionComponent } from '../customer-selection/customer-selection.component';

@Component({
  selector: 'app-pos-toolbar',
  templateUrl: './pos-toolbar.component.html',
  styleUrls: ['./pos-toolbar.component.scss']
})
export class PosToolbarComponent implements OnInit {
  customer: Customer;
  loginUserName:string
  branchName:string
  cartItemCount: number = 0;
  constructor(private localStorageService: LocalStorageService, public dialog: MatDialog, private authService: AuthService, private cartService: CartService, private themeService: ThemeService,private http:HttpClient) { }
  @Input() cart: MatSidenav;
  @Input() darkModeIcon: string;
  @Input() isDarkMode: boolean;
  ngOnInit(): void {
    this.customer=new Customer()
    this.customer.id='8156b38d-8724-4a18-8116-303bcf408701';
    this.customer.name='CASH CUSTOMER'
    this.customer.balance=0
    this.cartService.setCurrentCustomer(this.customer);
    this.cartService.getCustomerCart(this.customer.id);
  //  this.cartService.get().subscribe(res => this.cartItemCount = res.length);
   // this.cartService.getCurrentCustomer().subscribe(res=>this.customer = res);
    let themeVariant = this.localStorageService.getItem('themeVariant');
    this.darkModeIcon = themeVariant === 'dark-theme' ? 'bedtime' : 'wb_sunny';
    this.isDarkMode = themeVariant === 'dark-theme';
    this.getBranchName();
    this.loginUserName=this.authService.getFullName;
  }
  toggleDarkMode() {
    this.isDarkMode = this.themeService.toggleDarkMode();
    this.darkModeIcon = this.isDarkMode ? 'bedtime' : 'wb_sunny'
  }
  removeCustomer() {
    if (this.customer) {
      this.customer = null;
    }

    
  }

   

  openCustomerSelectionForm() {
    const dialogRef = this.dialog.open(CustomerSelectionComponent);
    dialogRef.afterClosed().subscribe((customer: Customer) => {
      if (customer) {
        this.customer = customer;
        console.log(customer)
        this.cartService.setCurrentCustomer(customer);
        this.cartService.getCustomerCart(customer.id);
      }
    });
  }

  getBranchName(){
    this.http.get<any>(environment.apiUrl+'branch/'+this.authService.getBranchId).subscribe(res=>{
    this.branchName=res.data?.name
    })
    }
}
