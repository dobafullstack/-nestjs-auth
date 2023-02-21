import { Global, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DataSource } from 'typeorm';
import { User } from './user.entity';
import { DATA_SOURCE, USER_REPOSITORY } from 'src/constants/constant';

@Global()
@Module({
	controllers: [UserController],
	providers: [
		UserService,
		{
			provide: USER_REPOSITORY,
			inject: [DATA_SOURCE],
			useFactory: (dataSource: DataSource) =>
				dataSource.getRepository(User)
		}
	],
	exports: [UserService]
})
export class UserModule {}
