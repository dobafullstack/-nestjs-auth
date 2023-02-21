import { Exclude } from 'class-transformer';
import { IsOptional, IsString, ValidateIf } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends CreateUserDto {
	@Exclude()
	password: string;

	@IsOptional()
	@ValidateIf((_, value) => value !== undefined)
	@IsString()
	name?: string;
}
