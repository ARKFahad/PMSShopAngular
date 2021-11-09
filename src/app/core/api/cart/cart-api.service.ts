import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CartApiModel } from '../../models/cart/cart';
import { Result } from '../../models/wrappers/Result';

@Injectable({
  providedIn: 'root'
})
export class CartApiService {

  baseUrl = environment.apiUrl + 'cart';

  constructor(private http: HttpClient) {
  }
  create(customerId: string) {
    return this.http.post<any>(this.baseUrl, { "customerId": customerId });
  }
  get(customerId: string) {
    let params = new HttpParams();
    params = params.append('customerId', customerId);
    return this.http.get<Result<CartApiModel[]>>(this.baseUrl, { params: params });
  }
   getCartByCustomerId(customerId: string) {
    let params = new HttpParams();
    params = params.append('customerId', customerId);
    return this.http.get<any>(this.baseUrl+'/'+customerId);
    
  }
  clear(cartId: string)
  {
    return this.http.post<any>(this.baseUrl+'/' + cartId,{});
  }
}
