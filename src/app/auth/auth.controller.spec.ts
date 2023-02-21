import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../user/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
	let controller: AuthController;
	let fakeAuthService: AuthService;

	const user: User = {
		id: 1,
		name: 'name',
		username: 'username',
		email: 'email',
		password: 'password'
	} as User;

	beforeEach(async () => {
		fakeAuthService = {
			register: (input) => Promise.resolve(user),
			login: (input) =>
				Promise.resolve({ accessToken: '', expires_in: 1 })
		} as AuthService;

		const module: TestingModule = await Test.createTestingModule({
			controllers: [AuthController],
			providers: [
				{
					provide: AuthService,
					useValue: fakeAuthService
				}
			]
		}).compile();

		controller = module.get<AuthController>(AuthController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	describe('register', () => {
		it('should register new user', async () => {
			const newUser = await controller.register({
				username: 'username',
				email: 'email',
				password: 'password'
			});

			expect(newUser).toEqual(user);
		});
	});

	describe('login', () => {
		it('should return accessToken and expires_in', async () => {
			const { accessToken, expires_in } = await controller.login({
				usernameOrEmail: 'usernameOrEmail',
				password: 'password'
			});

			expect(accessToken).toBeDefined();
			expect(expires_in).toBeDefined();
		});
	});
});
