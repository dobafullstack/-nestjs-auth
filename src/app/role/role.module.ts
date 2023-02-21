import { Global, Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { DATA_SOURCE, ROLE_REPOSITORY } from 'src/constants/constant';
import { DataSource } from 'typeorm';
import { Role } from './role.entity';

@Global()
@Module({
	controllers: [RoleController],
	providers: [
		RoleService,
		{
			provide: ROLE_REPOSITORY,
			inject: [DATA_SOURCE],
			useFactory: (dataSource: DataSource) =>
				dataSource.getRepository(Role)
		}
	],
	exports: [RoleService]
})
export class RoleModule {}
