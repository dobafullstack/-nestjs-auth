import {
	MiddlewareConsumer,
	Module,
	NestModule
} from '@nestjs/common';
import { providers } from './app.provider';
import { AuthModule } from './app/auth/auth.module';
import { RoleModule } from './app/role/role.module';
import { UserModule } from './app/user/user.module';
import { DatabaseModule } from './database/database.module';

@Module({
	imports: [DatabaseModule, UserModule, AuthModule, RoleModule],
	providers: providers
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		// consumer.apply(AuthMiddleware).forRoutes(AuthController);
	}
}
