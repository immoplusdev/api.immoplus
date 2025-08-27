export interface BaseHttpError {
  property: string;
  children: string[];
  constraints: Record<string, string>;
}

export class BaseException extends Error {
  statusCode: number;
  message: string;
  error?: string;
  code?: string;
  errors: BaseHttpError[];
  data?: Record<string, any> = undefined;

  constructor(
    message: string,
    statusCode: number,
    error?: string,
    code?: string,
    errors?: BaseHttpError[],
  ) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    if (error) this.error = error;
    if (code) this.code = code;
    if (errors) this.errors = errors;
  }

  setMessage(message: string) {
    this.message = message;
    return this;
  }

  setCode(code: string) {
    this.code = code;
    return this;
  }

  setError(error: string) {
    this.error = error;
    return this;
  }

  setData(data: any) {
    this.data = data;
    return this;
  }
}
