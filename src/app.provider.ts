import {
	BadRequestException,
	ClassSerializerInterceptor,
	Provider,
	ValidationPipe
} from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';
import { RoleGuard } from 'src/guards/role.guard';
import { ResponseTransformInterceptor } from 'src/interceptors/response-transform.interceptor';

export const providers: Provider<any>[] = [
	{
		provide: APP_INTERCEPTOR,
		useClass: ClassSerializerInterceptor
	},
	{
		provide: APP_INTERCEPTOR,
		useClass: ResponseTransformInterceptor
	},
	{
		provide: APP_GUARD,
		useClass: RoleGuard
	},
	{
		provide: APP_FILTER,
		useClass: HttpExceptionFilter
	},
	{
		provide: APP_PIPE,
		useFactory: () =>
			new ValidationPipe({
				exceptionFactory: (errors) => {
					throw new BadRequestException(
						errors.map((error) => ({
							field: error.property,
							message: Object.values(error.constraints)[0]
						}))
					);
				}
			})
	}
];
