import { NestMiddleware } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from 'src/app/user/user.service';
import { JWTHelper } from 'src/helpers/jwt.helper';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
	constructor(private readonly userService: UserService) {}

	async use(req: Request, res: Response, next: (error?: any) => void) {
		const bearerToken = req.headers['authorization'];

		const token = bearerToken.replace('Bearer ', '');

		JWTHelper.decode(token, (decode) => {
			req.user_id = decode.user_id;
		});

		req.user = await this.userService.findOneOrFail({ id: req.user_id });

		next();
	}
}
