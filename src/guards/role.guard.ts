import {
	CanActivate,
	ExecutionContext,
	ForbiddenException
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { ROLE_KEY } from 'src/constants/constant';
import { Roles } from 'src/decorators/role.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(
		context: ExecutionContext
	): boolean | Promise<boolean> | Observable<boolean> {
		const requiredRoles = this.reflector.getAllAndOverride<Roles[]>(
			ROLE_KEY,
			[context.getClass(), context.getHandler()]
		);

		if (!requiredRoles) return true;

		const request = context.switchToHttp().getRequest<Request>();

		const canActive = request.user.roles.some((role) =>
			requiredRoles.includes(role.name)
		);

		if (!canActive) {
			throw new ForbiddenException([
				{
					field: 'user.roles',
					message: "User doesn't have permission to access this route"
				}
			]);
		}

		return true;
	}
}
