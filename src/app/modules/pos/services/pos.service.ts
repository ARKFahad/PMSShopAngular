// import { CategoryParams } from './../models/categoryParams';
// import { HttpClient, HttpParams } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';
// import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';
// import { PaginatedResult } from 'src/app/core/models/wrappers/PaginatedResult';
// import { Result } from 'src/app/core/models/wrappers/Result';
// import { Brand } from '../models/brand';
// import { BrandParams } from '../models/brandParams';
// import { Customer } from '../models/customer/customer.model';
// import { Product } from '../models/product';
// import { ProductParams } from '../models/productParams';
// import { Category } from '../models/category';
// import { ProductRequestModel } from '../models/productRequestModel';
// import { CustomerRequest } from '../models/customer/customerRequest.model';
// import { environment } from 'src/environments/environment';
// import { CustomerApiService } from 'src/app/core/api/pos/customer-api.service';

// @Injectable({
//   providedIn: 'root',
// })
// export class PosService {
//   public isCustomerLoading: BehaviorSubject<boolean> =
//     new BehaviorSubject<boolean>(false);
//   constructor() // private productApi: ProductApiService, // private customerApi: CustomerApiService,
//   // private brandService: BrandApiService,
//   // private categoryService: CategoryApiService,
//   // private http: HttpClient
//   {}

//   // getProducts(
//   //   productParams: ProductParams
//   // ): Observable<PaginatedResult<Product>> {
//   //   let params = new HttpParams();
//   //   if (productParams.searchString) {
//   //     params = params.append('searchString', productParams.searchString);
//   //   }
//   //   if (productParams.pageSize) {
//   //     params = params.append('pageSize', productParams.pageSize.toString());
//   //   }
//   //   if (productParams.brandIds.length > 0) {
//   //     for (let i = 0; i < productParams.brandIds.length; i++) {
//   //       params = params.append('brandIds', productParams.brandIds[i]);
//   //     }
//   //   }
//   //   if (productParams.categoryIds.length > 0) {
//   //     for (let i = 0; i < productParams.categoryIds.length; i++) {
//   //       params = params.append('categoryIds', productParams.categoryIds[i]);
//   //     }
//   //   }
//   //   return this.productApi
//   //     .getAlls(params)
//   //     .pipe(map((response: PaginatedResult<Product>) => response));
//   // }

//   // getProductById(id: string): Observable<Result<Product>> {
//   //   return this.productApi
//   //     .getById(id)
//   //     .pipe(map((response: Result<Product>) => response));
//   // }

//   // getProductsList(productRequestModel: ProductRequestModel): Observable<any> {
//   //   return this.productApi
//   //     .getAllList(productRequestModel)
//   //     .pipe(map((response: any) => response));
//   // }

//   // getBrands(brandParams: BrandParams): Observable<PaginatedResult<Brand>> {
//   //   let params = new HttpParams();
//   //   if (brandParams.searchString)
//   //     params = params.append('searchString', brandParams.searchString);
//   //   if (brandParams.pageNumber)
//   //     params = params.append('pageNumber', brandParams.pageNumber.toString());
//   //   if (brandParams.pageSize)
//   //     params = params.append('pageSize', brandParams.pageSize.toString());
//   //   if (brandParams.orderBy)
//   //     params = params.append('orderBy', brandParams.orderBy.toString());
//   //   return this.brandService
//   //     .getAlls(params)
//   //     .pipe(map((response: PaginatedResult<Brand>) => response));
//   // }

//   // getBrandsList(filterValue: string): Observable<any> {
//   //   return this.brandService
//   //     .getAllList(filterValue)
//   //     .pipe(map((response: any) => response));
//   // }

//   // getCategories(filterValue: string): Observable<any> {
//   //   let params = new HttpParams();

//   //   return this.categoryService
//   //     .getAlls(filterValue)
//   //     .pipe(map((response: any) => response));
//   // }
// }
