import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DeepPartial, FindOneOptions } from 'typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';

describe('UserService', () => {
	let service: UserService;
	let user: User = {
		id: 1,
		name: 'Test',
		username: 'test',
		password: 'test_123',
		email: 'test@gmail.com'
	} as User;

	let fakeUserRepository;

	beforeEach(async () => {
		user.save = () => Promise.resolve(user);

		fakeUserRepository = {
			create: jest.fn((entityLike: DeepPartial<User>) => user),
			findOne: jest.fn((options: FindOneOptions<User>) =>
				Promise.resolve(user)
			),
			findOneOrFail: jest.fn((options: FindOneOptions<User>) =>
				Promise.resolve(user)
			),
			softRemove: jest.fn((entity: User) => Promise.resolve(user))
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				{
					provide: 'USER_REPOSITORY',
					useValue: fakeUserRepository
				},
				UserService
			]
		}).compile();

		service = module.get<UserService>(UserService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('create', () => {
		it('should create new user', async () => {
			const newUser = await service.create({
				email: 'test@gmail.com',
				password: 'test_123',
				username: 'test',
				roles: []
			});

			expect(newUser).toEqual(user);
		});
	});
	describe('findOne', () => {
		it('should throw ConflictException when user already exist and unique flag is true', async () => {
			await expect(service.findOne({}, true)).rejects.toThrow(
				ConflictException
			);
		});

		it('should return a user', async () => {
			const user_data = await service.findOne({});

			expect(user_data).toEqual(user);
		});
	});
	describe('findOneOrFail', () => {
		it('should throw NotFoundException when user was not found', async () => {
			fakeUserRepository.findOneOrFail = () =>
				Promise.reject(new NotFoundException());

			await expect(service.findOneOrFail({})).rejects.toThrow(
				NotFoundException
			);
		});
		it('should return a user', async () => {
			const user_data = await service.findOneOrFail({});

			expect(user_data).toEqual(user);
		});
	});
	describe('updateById', () => {
		it('should throw NotFoundException when user was not found', async () => {
			fakeUserRepository.findOneOrFail = () =>
				Promise.reject(new NotFoundException());

			await expect(
				service.updateById(1, { name: 'test_updated' })
			).rejects.toThrow(NotFoundException);
		});

		it('should update new user', async () => {
			const newUser: User = {
				id: 2,
				name: 'new_name',
				username: 'new_username',
				email: 'new_email@gmail.com'
			} as User;

			fakeUserRepository.update = () => {
				fakeUserRepository.findOneOrFail = () =>
					Promise.resolve(newUser);
			};

			const updated_user = await service.updateById(1, {});

			expect(updated_user).toEqual(newUser);
		});
	});

	describe('removeById', () => {
		it('should throw NotFoundException when user was not found', async () => {
			fakeUserRepository.findOneOrFail = () =>
				Promise.reject(new NotFoundException());

			await expect(service.removeById(1)).rejects.toThrow(
				NotFoundException
			);
		});
		it('should return an user was removed', async () => {
			const user_removed = await service.removeById(1);

			expect(user_removed).toEqual(user);
		});
	});
});
