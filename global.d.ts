import * as jwt from 'jsonwebtoken';
import { User } from 'src/app/user/user.entity';

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			NODE_ENV: 'development' | 'production' | 'test';
			PORT: string;
			ADMIN_PASSWORD: string;
			TYPEORM_HOST: string;
			TYPEORM_PORT: string;
			TYPEORM_USERNAME: string;
			TYPEORM_PASSWORD: string;
			TYPEORM_DATABASE_NAME: string;
			SECRET_JWT: string;
		}
	}
	namespace Express {
		export interface Request {
			user?: User;
			user_id?: number;
		}
	}
}

declare module 'jsonwebtoken' {
	function verify(
		token: string,
		secretOrPublicKey: Secret,
		callback?: jwt.VerifyCallback<JwtPayload>
	): JwtPayload;

	function sign(
		payload: SignPayload,
		secretOrPrivateKey: Secret,
		options?: SignOptions
	): string;

	interface JwtPayload extends jwt.JwtPayload {
		user_id?: number;
	}

	type SignPayload = string | Buffer | object | { user_id: string };
}

export {};
