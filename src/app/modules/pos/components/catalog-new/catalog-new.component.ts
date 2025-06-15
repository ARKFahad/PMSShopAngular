import { Component, OnInit } from '@angular/core';
import { StockService } from '../../services/stock.service';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../services/cart.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  startWith,
  switchMap,
} from 'rxjs/operators';

@Component({
  selector: 'app-catalog-new',
  templateUrl: './catalog-new.component.html',
  styleUrls: ['./catalog-new.component.scss'],
})
export class CatalogNewComponent implements OnInit {
  products: any;
  searchForm: FormGroup;
  searchString: string;
  hasProductsLoaded: boolean = false;
  invalidCart: boolean = true;

  constructor(
    private fb: FormBuilder,
    private stockService: StockService,
    private toastr: ToastrService,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      keyword: [''],
    });
    // Search optimization
    this.searchForm
      .get('keyword')
      .valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        startWith(''), // load initially
        filter(
          (keyword: string) => keyword.trim().length > 0 || keyword === ''
        ),
        switchMap((keyword: string) => this.fetchProducts(keyword.trim()))
      )
      .subscribe((res) => {
        this.products = res?.data?.item1 ?? [];
        this.hasProductsLoaded = true;
      });
  }

  fetchProducts(keyword: string = '') {
    this.hasProductsLoaded = false;
    const params = {
      branchId: this.authService.getBranchId,
      productName: keyword,
    };

    return this.stockService.getPosSearchProduct(params);
  }

  resetFilter() {
    this.searchForm.get('keyword').setValue('');
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
    if (this.isCustomerSelected()) {
      this.cartService.add(product);
    }
  }
}
