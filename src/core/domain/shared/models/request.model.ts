// 
export interface ReqError {
  message: string;
  extensions: {
    code: string;
    status?: number;
  };
}

export interface BaseResponse<T> {
  data?: T;
  message?: string;
  errors?: ReqError[];
  meta?: {
    total_count: number;
    filter_count: number;
  };
}

export type EmptyBaseResponse = BaseResponse<undefined>;

export interface DataResponse<T> {
  data?: T;
}

export interface ExceptionResponse {
  errors?: ReqError[];
}

export interface MessageResponse {
  message?: string;
}
