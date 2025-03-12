import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ExpressRequest } from '../types/expressRequest.interface';

export const UserId = createParamDecorator((_: any, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<ExpressRequest>();

  return request.userId;
});
