import { IncomingMessage } from "http";
import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const ReqHeader = createParamDecorator((name: string, ctx: ExecutionContext): string | undefined => {
  const req = ctx.switchToHttp().getRequest<IncomingMessage>();
  const { headers } = req;

  return headers[name] as string;
});

export const ReqHeaders = createParamDecorator((name: string = null, ctx: ExecutionContext): string | Record<string, any> => {
  const req = ctx.switchToHttp().getRequest<IncomingMessage>();
  const { headers } = req;
  return name == null ? headers as Record<string, any> : headers[name] as string;
});