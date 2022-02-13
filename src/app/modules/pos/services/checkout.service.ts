import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CheckoutApiService } from 'src/app/core/api/checkout/checkout-api.service';
import { Result } from 'src/app/core/models/wrappers/Result';
import { environment } from 'src/environments/environment';
import { CheckOut } from '../models/checkOut';
import { CheckOutParams } from '../models/checkOutParams';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  constructor(public checkOutApi: CheckoutApiService,private http:HttpClient) { }
  submitOrder(data:CheckOut): any {
    return this.checkOutApi.submitOrder(data)
      .pipe(map((response: any) => {
        return response;
      }));
  }
   getInvoiceReport(saleid: string) {
    return this.http.get(environment.apiUrl+'sale/invoice/'+saleid, { responseType: 'blob', observe: 'response'}).pipe(
      map((res: any) => {
        return new Blob([res.body], { type: 'application/pdf' });
      })
    );
  }
}
