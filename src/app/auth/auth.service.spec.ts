require('dotenv').config({
	path: `.env.${process.env.NODE_ENV}`
});

import {
	ConflictException,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from '../role/role.entity';
import { RoleService } from '../role/role.service';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as argon2 from 'argon2';

describe('AuthService', () => {
	let service: AuthService;
	let fakeUserService: UserService;
	let fakeRoleService: RoleService;

	let user: User;

	const role: Role = {
		id: 1,
		name: Roles.ADMIN
	} as Role;

	beforeEach(async () => {
		const hashedPassword = await argon2.hash('password');

		user = {
			id: 1,
			name: 'name',
			username: 'username',
			email: 'email',
			password: hashedPassword
		} as User;

		fakeUserService = {
			create: (input) => Promise.resolve(user),
			findOne: () => Promise.resolve(user),
			findOneOrFail: () => Promise.resolve(user)
		} as UserService;

		fakeRoleService = {
			findOneOrFail: () => Promise.resolve(role)
		} as RoleService;

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthService,
				{
					provide: UserService,
					useValue: fakeUserService
				},
				{
					provide: RoleService,
					useValue: fakeRoleService
				}
			]
		}).compile();

		service = module.get<AuthService>(AuthService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('register', () => {
		const payload: RegisterDto = {
			username: 'username',
			email: 'email',
			password: 'password'
		};

		it('should throw ConflictException when user has already exist', async () => {
			fakeUserService.findOne = () =>
				Promise.reject(new ConflictException());

			await expect(service.register(payload)).rejects.toThrow(
				ConflictException
			);
		});
		it('should throw NotFoundException when role was not found', async () => {
			fakeRoleService.findOneOrFail = () =>
				Promise.reject(new NotFoundException());

			await expect(service.register(payload)).rejects.toThrow(
				NotFoundException
			);
		});
		it('should create a new user', async () => {
			const newUser = await service.register(payload);

			expect(newUser).toEqual(user);
		});
	});

	describe('login', () => {
		let payload: LoginDto;

		beforeEach(() => {
			payload = {
				usernameOrEmail: 'email',
				password: 'password'
			};
		});

		it('should throw NotFoundException when user was not found', async () => {
			fakeUserService.findOneOrFail = () =>
				Promise.reject(new NotFoundException());

			await expect(service.login(payload)).rejects.toThrow(
				NotFoundException
			);
		});
		it('should throw UnauthorizedException when password is wrong', async () => {
			await expect(
				service.login({
					...payload,
					password: 'another_password'
				})
			).rejects.toThrow(UnauthorizedException);
		});
		it('should return accessToken', async () => {
			const {accessToken, expires_in} = await service.login(payload);

      expect(accessToken).toBeDefined()
      expect(expires_in).toBeDefined()
		});
	});
});
