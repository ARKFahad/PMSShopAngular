import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Result } from '../../models/wrappers/Result';

@Injectable({
  providedIn: 'root'
})
export class CheckoutApiService {

  baseUrl = environment.apiUrl + 'sale';

  constructor(private http: HttpClient) {
  }
  submitOrder(cartId: string,discount:number) {
    return this.http.post<any>(this.baseUrl, { "cartId": cartId ,discount});
  }
}
