import { UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export class JWTHelper {
	public static EXPIRES_IN = 300;

	static sign(payload: jwt.SignPayload) {
		return jwt.sign(payload, process.env.SECRET_JWT, {
			expiresIn: JWTHelper.EXPIRES_IN
		});
	}

	static decode(token: string, callback?: (decode: jwt.JwtPayload) => void) {
		jwt.verify(token, process.env.SECRET_JWT, (err, decode) => {
			if (err) {
				throw new UnauthorizedException([
					{
						field: 'jwt',
						message: err.message.split(' ').join('_').toUpperCase()
					}
				]);
			}

			callback(decode);
		});
	}
}
