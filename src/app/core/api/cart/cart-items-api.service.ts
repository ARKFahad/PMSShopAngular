import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CartItemApiModel } from '../../models/cart/cart-item';
import { Result } from '../../models/wrappers/Result';

@Injectable({
  providedIn: 'root'
})
export class CartItemsApiService {
  baseUrl = environment.apiUrl + 'cartitem';
  constructor(private http: HttpClient) {
  }
  get(cartId: string) {
    let params = new HttpParams();
    params = params.append('cartId', cartId);
    return this.http.get<any>(this.baseUrl+'/'+cartId);
  }
  create(cartItem: CartItemApiModel) {
    return this.http.post<any>(this.baseUrl, cartItem);
  }

  update(cartItem: CartItemApiModel) {
    return this.http.post<any>(this.baseUrl+'/UpdateCart', cartItem);
  }
  delete(id: string) {
    return this.http.post<any>(this.baseUrl+'/' + id,{});
  }
}
