import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaymentMethodApiService } from 'src/app/core/api/pos/payment-method-api.service';

@Injectable({
  providedIn: 'root',
})
export class PaymentMethodService {
  constructor(private api: PaymentMethodApiService) {}

  getPaymentMethodList(): Observable<any> {
    return this.api.getAllList().pipe(
      map((response: any) => {
        return response;
      })
    );
  }
}
