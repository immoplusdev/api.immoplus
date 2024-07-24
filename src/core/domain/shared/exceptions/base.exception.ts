export interface BaseHttpError {
  property: string;
  children: string[];
  constraints: Record<string, string>;
}
export class BaseException extends Error {
  statusCode: number;
  message: string;
  errors: BaseHttpError[];

  constructor(message: string, statusCode: number, errors?: BaseHttpError[]) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    if (errors) this.errors = errors;
  }
}
