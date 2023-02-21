import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const http = host.switchToHttp();
		const response = http.getResponse<Response>();
		const message = exception.message.split(' ').join('_').toUpperCase();
		const statusCode = exception.getStatus();
		const errors = (exception.getResponse() as any).message;

		return response.status(statusCode).json({
			code: statusCode,
			success: false,
			message,
			errors,
			data: []
		});
	}
}
