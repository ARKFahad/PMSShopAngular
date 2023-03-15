import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../services/cart.service';
import { ProductRequestModel } from '../../models/productRequestModel';
import { AuthService } from 'src/app/core/services/auth.service';
import { StockService } from '../../services/stock.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss'],
})
export class CatalogComponent implements OnInit {
  products: any;
  productRequestModel = new ProductRequestModel();
  searchString: string;
  hasProductsLoaded: boolean = false;
  invalidCart: boolean = true;
  constructor(
    private stockService: StockService,
    private toastr: ToastrService,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.productRequestModel.keyword = '';
    this.productRequestModel.supplierIds = [];
    this.productRequestModel.categoryIds = [];
    this.productRequestModel.rowsPerPage = 20;
    this.productRequestModel.branchId = this.authService.getBranchId;
    this.getProducts();
  }

  getProducts() {
    this.hasProductsLoaded = false;
    const params = {
      branchId: this.productRequestModel.branchId,
      productName: this.productRequestModel.keyword,
    };
    this.stockService.getPosSearchProduct(params).subscribe((res) => {
      this.products = res?.data?.item1;
      this.hasProductsLoaded = true;
    });
  }

  public doFilter(): void {
    this.getProducts();
  }

  isCustomerSelected() {
    const currentCustomer = this.cartService.getCurrentCustomer();
    if (!currentCustomer) {
      this.toastr.error('Select a customer');
      return false;
    }
    return true;
  }

  addToCart(product: any) {
    console.log(product);
    if (this.isCustomerSelected()) {
      this.cartService.add(product);
    }
  }

  resetFilter() {
    this.productRequestModel.keyword = '';
    this.productRequestModel.supplierIds = [];
    this.productRequestModel.categoryIds = [];
    this.getProducts();
  }
}
