import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import { Brand } from 'src/app/modules/admin/catalog/models/brand';
import {environment} from 'src/environments/environment';

@Injectable()
export class BrandApiService {

  baseUrl = environment.apiUrl + 'supplier';
 // baseUrl = 'http://103.91.229.10/pms/api/supplier';

  constructor(private http: HttpClient) {
  }

  getAlls(params: HttpParams) {
    return this.http.get(this.baseUrl, {params: params});
  }
  getAllList(filterValue:string) {
    return this.http.post(this.baseUrl+'/search', {page:-1,keyword:filterValue});
  }

  getById(id: string) {
    return this.http.get<Brand>(this.baseUrl + id);
  }

  create(brand: Brand) {
    return this.http.post(this.baseUrl, brand);
  }

  update(brand: Brand) {
    return this.http.put(this.baseUrl, brand);
  }

  delete(id: string) {
    return this.http.delete(this.baseUrl + id);
  }
}
