import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CustomerApiService } from 'src/app/core/api/pos/customer-api.service';
import { Result } from 'src/app/core/models/wrappers/Result';
import { Customer } from '../models/customer/customer.model';
import { CustomerRequest } from '../models/customer/customerRequest.model';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  public isCustomerLoading: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  constructor(private api: CustomerApiService) {}

  getCustomerList(customerRequestModel: CustomerRequest): Observable<any> {
    this.isCustomerLoading.next(true);
    return this.api.getAllList(customerRequestModel).pipe(
      map((response: any) => {
        this.isCustomerLoading.next(false);
        return response;
      })
    );
  }

  getCustomerById(id: string): Observable<Result<Customer>> {
    return this.api
      .getById(id)
      .pipe(map((response: Result<Customer>) => response));
  }
}
