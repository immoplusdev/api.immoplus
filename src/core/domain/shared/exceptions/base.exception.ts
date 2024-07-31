export interface BaseHttpError {
  property: string;
  children: string[];
  constraints: Record<string, string>;
}

export class BaseException extends Error {
  statusCode: number;
  message: string;
  errors: BaseHttpError[];
  data?: Record<string, any> = undefined;

  constructor(message: string, statusCode: number, errors?: BaseHttpError[]) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    if (errors) this.errors = errors;
  }


  setMessage(message: string) {
    this.message = message;
    return this;
  }

  setData(data: any){
    this.data = data;
    return this;
  }
}
