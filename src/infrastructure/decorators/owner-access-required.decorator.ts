import { SetMetadata, applyDecorators, createParamDecorator } from "@nestjs/common";
import { CallHandler, ExecutionContext, Injectable, NestInterceptor, UseInterceptors } from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { OwnerAccessRequiredInterceptor } from "@/infrastructure/interceptors";

export const OWNER_ACCESS_REQUIRED_KEY = "OWNER_ACCESS_REQUIRED_KEY";

// export function OwnerAccessRequired(entityField:string, userDataField:string): MethodDecorator {
//   return applyDecorators(
//     SetMetadata(OWNER_ACCESS_REQUIRED_KEY, true),
//     UseInterceptors(OwnerAccessRequiredInterceptor, entityField, userDataField),
//   );
// }


// export const OwnerAccessRequired = createParamDecorator(
//   (entityField: string[], ctx: ExecutionContext) => {
//     const user = ctx.switchToHttp().getRequest().user;
//     if (!user) return null;
//     if(entityField[])
//     return property ? user[property] : user;
//   },
// );