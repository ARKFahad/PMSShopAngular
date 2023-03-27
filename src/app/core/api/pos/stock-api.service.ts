import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StockApiService {
  baseUrl = environment.apiUrl + 'stock';

  constructor(private http: HttpClient) {}

  getPosSearchProduct(params) {
    return this.http.get(this.baseUrl + '/pos-search', { params: params });
  }
}
