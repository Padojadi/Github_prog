export class PaginationMeta {
  currentPage: number;
  perPage: number;
  total: number;
  totalPages: number;

  constructor(currentPage: number, perPage: number, total: number) {
    this.currentPage = currentPage;
    this.perPage = perPage;
    this.total = total;
    this.totalPages = perPage <= 0 ? 0 : Math.ceil(total / perPage);
  }
}
