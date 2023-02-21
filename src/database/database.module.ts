import { Global, Module } from '@nestjs/common';
import dataSource from 'ormconfig';
import { DATA_SOURCE } from 'src/constants/constant';

@Global()
@Module({
	providers: [
		{
			provide: DATA_SOURCE,
			useFactory: () => dataSource.initialize()
		}
	],
	exports: [DATA_SOURCE]
})
export class DatabaseModule {}
