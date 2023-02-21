import { Test, TestingModule } from '@nestjs/testing';
import { ROLE_REPOSITORY } from 'src/constants/constant';
import { Repository } from 'typeorm';
import { RoleController } from './role.controller';
import { Role } from './role.entity';
import { RoleService } from './role.service';

describe('RoleController', () => {
	let controller: RoleController;
	let fakeRoleRepository: Repository<Role>;

	beforeEach(async () => {
		fakeRoleRepository = {} as Repository<Role>;

		const module: TestingModule = await Test.createTestingModule({
			controllers: [RoleController],
			providers: [
				RoleService,
				{
					provide: ROLE_REPOSITORY,
					useValue: fakeRoleRepository
				}
			]
		}).compile();

		controller = module.get<RoleController>(RoleController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
