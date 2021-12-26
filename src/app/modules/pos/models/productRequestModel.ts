import { PaginatedFilter } from 'src/app/core/models/Filters/PaginatedFilter';

export class ProductRequestModel {
  keyword: string;
  supplierIds: string[];
  categoryIds: string[];
  branchId:string
  page: number;
  rowsPerPage: number;
}
