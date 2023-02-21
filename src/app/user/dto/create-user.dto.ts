import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { Role } from 'src/app/role/role.entity';

export class CreateUserDto {
	@IsString()
	@IsNotEmpty()
	username: string;

	@IsString()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsNotEmpty()
	password: string;

	@IsArray()
	roles: Role[];
}
