import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ROLE_REPOSITORY } from 'src/constants/constant';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from './role.entity';
import { RoleService } from './role.service';

describe('RoleService', () => {
	let service: RoleService;
	let fakeRoleRepository;

	const role: Role = {
		id: 1,
		name: Roles.ADMIN
	} as Role;

	beforeEach(async () => {
		fakeRoleRepository = {
			findOne: jest.fn(() => Promise.resolve(role)),
			findOneOrFail: jest.fn(() => Promise.resolve(role))
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				RoleService,
				{
					provide: ROLE_REPOSITORY,
					useValue: fakeRoleRepository
				}
			]
		}).compile();

		service = module.get<RoleService>(RoleService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('findOne', () => {
		it('should throw ConflictException when role already exist and unique flag is true', async () => {
			await expect(service.findOne({}, true)).rejects.toThrow(
				ConflictException
			);
		});

		it('should return a role', async () => {
			const role_data = await service.findOne({});

			expect(role_data).toEqual(role);
		});
	});
	describe('findOneOrFail', () => {
		it('should throw NotFoundException when role was not found', async () => {
			fakeRoleRepository.findOneOrFail = () =>
				Promise.reject(new NotFoundException());

			await expect(service.findOneOrFail({})).rejects.toThrow(
				NotFoundException
			);
		});
		it('should return a role', async () => {
			const role_data = await service.findOneOrFail({});

			expect(role_data).toEqual(role);
		});
	});
});
