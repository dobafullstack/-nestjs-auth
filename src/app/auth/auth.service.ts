import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { Roles } from 'src/decorators/role.decorator';
import { JWTHelper } from 'src/helpers/jwt.helper';
import { RoleService } from '../role/role.service';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly roleService: RoleService
	) {}

	/**
	 * Register a new user with Client role
	 * * This method is using `findOne` method of `UserService` with `unique=true`. So it can throw a `ConflictException` when user already exist
	 * * This method is using `findOneOrFail` method of `RoleService`. So it can throw a `NotFoundException` when role was not found
	 * @param input RegisterDto { username, email, password }
	 * @returns `Promise<User>`
	 */
	async register(input: RegisterDto) {
		const { username, email } = input;

		//Make sure user is unique
		await this.userService.findOne([{ username }, { email }], true);

		const role = await this.roleService.findOneOrFail({
			name: Roles.CLIENT
		});

		return this.userService.create({
			...input,
			roles: [role]
		});
	}

	/**
	 * Login to system
	 * * This method is using `findOneOrFail` method of `UserService`. So it can throw a `NotFoundException` when user was not found
	 * * If user type wrong password, throw an `UnauthorizedException`
	 * @param input LoginDto { usernameOrEmail, password }
	 * @returns `Promise<{ accessToken, expires_in }>`
	 */
	async login(input: LoginDto) {
		const { usernameOrEmail, password } = input;

		const user = await this.userService.findOneOrFail([
			{ username: usernameOrEmail },
			{ email: usernameOrEmail }
		]);

		const verifyPassword = await argon2.verify(user.password, password);

		if (!verifyPassword) {
			throw new UnauthorizedException([
				{
					field: 'password',
					message: 'INVALID_PASSWORD'
				}
			]);
		}

		//Generate jsonwebtoken
		const accessToken = JWTHelper.sign({ user_id: user.id });

		return {
			accessToken,
			expires_in: JWTHelper.EXPIRES_IN
		};
	}
}
