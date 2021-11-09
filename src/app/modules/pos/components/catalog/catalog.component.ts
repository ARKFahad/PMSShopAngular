import { CategoryParams } from './../../models/categoryParams';
import { Category } from './../../models/category';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PaginatedResult } from 'src/app/core/models/wrappers/PaginatedResult';
import { BusyService } from 'src/app/core/services/busy.service';
import { Brand } from '../../models/brand';
import { BrandParams } from '../../models/brandParams';
import { Product } from '../../models/product';
import { ProductParams } from '../../models/productParams';
import { CartService } from '../../services/cart.service';
import { PosService } from '../../services/pos.service';
import { ProductRequestModel } from '../../models/productRequestModel';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {
  brands: any;
  categories: any;
  products: any;
  productRequestModel=new ProductRequestModel();
  searchString: string;
  brandAutoComplete = new FormControl();
  categoryAutoComplete = new FormControl();
  showImage: boolean = false;
  hasProductsLoaded: boolean = false;
  invalidCart: boolean = true;
  constructor(private posService: PosService, private toastr: ToastrService, public cartService: CartService, public busyService: BusyService) { }

  ngOnInit(): void {
   
    this.productRequestModel.keyword = '';
    this.productRequestModel.supplierIds = [];
    this.productRequestModel.categoryIds = [];
    this.productRequestModel.rowsPerPage = 60;
    this.getProducts();
    this.getBrands('');
    this.getCategories('');
    this.brandAutoComplete.valueChanges.subscribe((value) => this._filterBrand(value));
    this.categoryAutoComplete.valueChanges.subscribe((value) => this._filterCategory(value));
  }

  getProducts() {
    this.hasProductsLoaded = false;
    this.posService.getProductsList(this.productRequestModel).subscribe((res) => { this.products = res?.data?.item1, this.hasProductsLoaded = true });
  }

  getBrands(filterValue:string) {
    this.posService.getBrandsList(filterValue).subscribe((res) => { this.brands = res?.data?.item1; });
  }

  getCategories(filterValue:string) {
    this.posService.getCategories(filterValue).subscribe((res) => {
      console.log(res)
       this.categories = res?.data?.item1; 
      });
  }

  isCheckedBrand(brand: Brand): boolean {
    if (this.productRequestModel.supplierIds.includes(brand.id)) return true;
    return false;
  }

  isCheckedCategory(category: Category): boolean {
    if (this.productRequestModel.categoryIds.includes(category.id)) return true;
    return false;
  }

  toggleBrandSelection($event, brand: Brand) {
    if ($event.checked) {
      if (!this.productRequestModel.supplierIds.includes(brand.id)) this.productRequestModel.supplierIds.push(brand.id);
    } else {
      if (this.productRequestModel.supplierIds.includes(brand.id)) this.productRequestModel.supplierIds = this.productRequestModel.supplierIds.filter(item => item !== brand.id);
    }
    this.getProducts();
  }

  toggleCategorySelection($event, category: Category) {
    if ($event.checked) {
      if (!this.productRequestModel.categoryIds.includes(category.id)) this.productRequestModel.categoryIds.push(category.id);
    } else {
      if (this.productRequestModel.categoryIds.includes(category.id)) this.productRequestModel.categoryIds = this.productRequestModel.categoryIds.filter(item => item !== category.id);
    }
    this.getProducts();
  }

  private _filterBrand(value: string) {
    const filterValue = value.toLowerCase();
    this.getBrands(filterValue);
  }

  private _filterCategory(value: string) {
    const filterValue = value.toLowerCase();
    this.getCategories(filterValue);
  }

  public doFilter(): void {
    this.getProducts();
  }
getProductStock(productId: string) {
   return 
  }
  getBrandName(brandId: string) {
    if (this.brands  && this.brands.find(item => item.id === brandId)) {
      return this.brands.find(brand => brand.id === brandId).name;
    }
  }

  getCategoryName(categoryId: string) {
    //alert(categoryId)
  //  console.log(this.categories)
    if (this.categories && this.categories.find(item => item.id === categoryId)) {
     // alert(categoryId)
      return this.categories.find(category => category.id === categoryId).name;
    }
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
    console.log(product)
    if (this.isCustomerSelected()) {
      this.cartService.add(product);
    }

  }
  // toggleImage() {
  //   this.showImage = !this.showImage;
  // }
  resetFiter() {
   this.productRequestModel.keyword='';
   this.productRequestModel.supplierIds=[];
   this.productRequestModel.categoryIds=[];
   this.getProducts();
  }

}
