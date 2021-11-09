import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Customer } from 'src/app/modules/admin/people/models/customer';
import { CustomerRequestModel } from 'src/app/modules/pos/models/customerRequestModel';
import { environment } from 'src/environments/environment';
import { Result } from '../../models/wrappers/Result';

@Injectable()
export class CustomerApiService {

  baseUrl = environment.apiUrl + 'customer';
  // baseUrl = 'http://103.91.229.10/pms/api/Customer';

  constructor(private http: HttpClient) {
  }

  getAllList(customerRequestModel:CustomerRequestModel) {
    return this.http.post(this.baseUrl+'/search', customerRequestModel);
  }


  getAlls(params: HttpParams) {
    return this.http.get(this.baseUrl, {params: params});
  }

  getById(id: string) {
    return this.http.get<Result<Customer>>(this.baseUrl + `/${id}`);
  }

  create(customer: Customer) {
    return this.http.post(this.baseUrl, customer);
  }

  update(customer: Customer) {
    return this.http.put(this.baseUrl, customer);
  }

  delete(id: string) {
    return this.http.delete(this.baseUrl + `/${id}`);
  }
}
