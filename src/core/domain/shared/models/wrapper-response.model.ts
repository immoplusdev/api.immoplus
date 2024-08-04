export class WrapperResponse<T> {
  data: T;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  hasPrevious: boolean;
  hasNext: boolean;


  buildFromOuterResponse(data: Partial<WrapperResponse<T>>) {
    Object.assign(this, data);
    return this;
  }

  paginate(options: WrapperResponsePaginationOptions) {
    if (!Array.isArray(this.data)) return this;
    this.currentPage = options.currentPage;
    this.totalPages = Math.floor(options.totalCount / options.pageSize);
    this.pageSize = options.pageSize;
    this.totalCount = options.totalCount;
    this.hasNext = this.currentPage < this.totalPages;
    this.hasPrevious = this.currentPage > 1;
    return this;
  }

  constructor(data?: T) {
    if (data) this.data = data;
  }
}

export class WrapperResponsePaginationOptions {
  totalCount: number;
  currentPage: number;
  pageSize: number;

  constructor(data?: Partial<WrapperResponsePaginationOptions>) {
    if (data) Object.assign(this, data);
  }
}
