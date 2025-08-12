import { Component, NgZone, OnInit } from '@angular/core';
import { StockService } from '../../services/stock.service';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../services/cart.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  catchError,
  debounceTime,
  delay,
  distinctUntilChanged,
  filter,
  finalize,
  retryWhen,
  startWith,
  switchMap,
  take,
  takeUntil,
  tap,
  timeout,
} from 'rxjs/operators';
import { fromEvent, of, Subject } from 'rxjs';

@Component({
  selector: 'app-catalog-new',
  templateUrl: './catalog-new.component.html',
  styleUrls: ['./catalog-new.component.scss'],
})
export class CatalogNewComponent implements OnInit {
  showImage = true;
  products: any[] = [];
  searchForm: FormGroup;
  searchString: string;
  hasProductsLoaded: boolean = false;
  invalidCart: boolean = true;
  isError: boolean = false;
  errorMessage: string = '';
  isOnline = navigator.onLine;
  lastSearchKeyword: string = '';
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private stockService: StockService,
    private toastr: ToastrService,
    private cartService: CartService,
    private authService: AuthService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      keyword: [''],
    });

    // Network status listeners inside NgZone
    fromEvent(window, 'online')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.ngZone.run(() => {
          this.isOnline = true;
          console.log(this.isOnline);
          console.log(this.isError);
          // Auto retry last search when back online
          if (this.lastSearchKeyword !== null) {
            this.searchForm.get('keyword').setValue(this.lastSearchKeyword);
          }
        });
      });

    fromEvent(window, 'offline')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.ngZone.run(() => {
          this.isOnline = false;
          this.isError = true;
          this.errorMessage = 'No internet connection.';
        });
      });

    // Search optimization + error handling
    this.searchForm
      .get('keyword')
      .valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        startWith(''), // load initially
        filter(
          (keyword: string) => keyword.trim().length > 0 || keyword === ''
        ),
        tap((keyword) => (this.lastSearchKeyword = keyword.trim())),
        switchMap((keyword: string) => {
          this.hasProductsLoaded = false;
          this.isError = false;
          this.errorMessage = '';
          return this.fetchProducts(keyword.trim()).pipe(
            catchError((err) => {
              this.isError = true;
              this.errorMessage = 'Failed to fetch products. Please try again.';
              return of({ data: { item1: [] } }); // fallback empty
            }),
            finalize(() => {
              this.hasProductsLoaded = true;
            })
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((res) => {
        this.products = res?.data?.item1 ?? [];
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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
