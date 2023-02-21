import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Response } from 'express';
import { map, Observable } from 'rxjs';
import { MESSAGE_KEY } from 'src/constants/constant';

@Injectable()
export class ResponseTransformInterceptor implements NestInterceptor {
	constructor(private reflector: Reflector) {}

	intercept(
		context: ExecutionContext,
		next: CallHandler<any>
	): Observable<any> | Promise<Observable<any>> {
		const code = context.switchToHttp().getResponse<Response>().statusCode;
		const message = this.reflector.getAllAndOverride<string>(MESSAGE_KEY, [
			context.getHandler(),
			context.getClass()
		]);

		return next.handle().pipe(
			map((data) => ({
				code,
				success: true,
				message: message || 'SUCCESS',
				errors: [],
				data: data || []
			}))
		);
	}
}
