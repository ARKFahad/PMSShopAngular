import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Category } from 'src/app/modules/admin/catalog/models/category';

@Injectable()
export class CategoryApiService {
  baseUrl = environment.apiUrl + 'category';
  //baseUrl = 'http://103.91.229.10/pms/api/category';

  constructor(private http: HttpClient) {
  }

  getAlls(filterValue:string) {
    return this.http.post(this.baseUrl+'/search', {page:-1,keyword:filterValue});
  }

  getById(id: string) {
    return this.http.get<Category>(this.baseUrl + id);
  }

  create(category: Category) {
    return this.http.post(this.baseUrl, category);
  }

  update(category: Category) {
    return this.http.put(this.baseUrl, category);
  }

  delete(id: string) {
    return this.http.delete(this.baseUrl + id);
  }
}
