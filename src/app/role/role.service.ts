import {
	ConflictException,
	Inject,
	Injectable,
	NotFoundException
} from '@nestjs/common';
import { ROLE_REPOSITORY } from 'src/constants/constant';
import {
	getFieldConflictException,
	getFieldNotFoundException
} from 'src/helpers/get-field-error.helper';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Role } from './role.entity';

@Injectable()
export class RoleService {
	constructor(
		@Inject(ROLE_REPOSITORY)
		private readonly roleRepository: Repository<Role>
	) {}

	/**
	 * Find a Role match with condition
	 * @param where Find condition
	 * @param unique Default is `false`. When its value is `true`, method will find a role, if role is exist, throw a `ConflictException`
	 * @returns `Promise<Role>`
	 */
	async findOne(
		where?: FindOptionsWhere<Role> | FindOptionsWhere<Role>[],
		unique: boolean = false
	) {
		const role = await this.roleRepository.findOne({ where });

		if (role && unique) {
			const errors = getFieldConflictException(role, where);

			throw new ConflictException(errors);
		}

		return role;
	}

	/**
	 * Find a Role match with condition. If have no Role was found, throw a `NotFoundException`
	 * @param where Find condition
	 * @returns `Promise<Role>`
	 */
	async findOneOrFail(
		where?: FindOptionsWhere<Role> | FindOptionsWhere<Role>[]
	) {
		try {
			const role = await this.roleRepository.findOneOrFail({ where });

			return role;
		} catch (error) {
			const errors = await getFieldNotFoundException(
				this.roleRepository,
				where
			);

			throw new NotFoundException(errors);
		}
	}
}
