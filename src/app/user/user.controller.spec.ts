import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';

describe('UserController', () => {
	let controller: UserController;

	let fakeUserRepository: Repository<User>;

	beforeEach(async () => {
		fakeUserRepository = {} as Repository<User>;

		const module: TestingModule = await Test.createTestingModule({
			controllers: [UserController],
			providers: [
				{
					provide: 'USER_REPOSITORY',
					useValue: fakeUserRepository
				},
				UserService
			]
		}).compile();

		controller = module.get<UserController>(UserController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
