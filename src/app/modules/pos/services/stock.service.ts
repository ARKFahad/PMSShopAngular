import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StockApiService } from 'src/app/core/api/pos/stock-api.service';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  constructor(private api: StockApiService) {}

  getPosSearchProduct(params): Observable<any> {
    return this.api.getPosSearchProduct(params).pipe(map((res) => res));
  }
}
