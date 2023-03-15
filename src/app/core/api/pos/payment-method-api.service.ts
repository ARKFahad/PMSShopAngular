import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PaymentMethodApiService {
  baseUrl = environment.apiUrl + 'PaymentMethod';

  constructor(private http: HttpClient) {}

  getAllList() {
    return this.http.post(this.baseUrl + '/search', { page: -1 });
  }
}
