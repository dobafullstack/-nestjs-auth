import { SetMetadata } from '@nestjs/common';
import { ROLE_KEY } from 'src/constants/constant';

export enum Roles {
	ADMIN = 'admin',
	CLIENT = 'client'
}

export const UseRoles = (...roles: Roles[]) => SetMetadata(ROLE_KEY, roles);
