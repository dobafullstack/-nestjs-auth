import {
	ConflictException,
	Inject,
	Injectable,
	NotFoundException
} from '@nestjs/common';
import { USER_REPOSITORY } from 'src/constants/constant';
import {
	getFieldConflictException,
	getFieldNotFoundException
} from 'src/helpers/get-field-error.helper';
import { FindOptionsWhere, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
	constructor(
		@Inject(USER_REPOSITORY)
		private readonly userRepository: Repository<User>
	) {}

	/**
	 * Create a new User
	 * @param input CreateUserDto { username, email, password, roles }
	 * @returns `Promise<User>`
	 */
	async create(input: CreateUserDto) {
		return this.userRepository.create({ ...input }).save();
	}

	/**
	 * Find an User match with condition
	 * @param where Find condition
	 * @param unique Default is `false`. When its value is `true`, method will find an user, if user is exist, throw a `ConflictException`
	 * @returns `Promise<User>`
	 */
	async findOne(
		where?: FindOptionsWhere<User> | FindOptionsWhere<User>[],
		unique: boolean = false
	) {
		const user = await this.userRepository.findOne({ where });

		if (user && unique) {
			const errors = getFieldConflictException(user, where);

			throw new ConflictException(errors);
		}

		return user;
	}

	/**
	 * Find an User match with condition. If have no User was found, throw a `NotFoundException`
	 * @param where Find condition
	 * @returns `Promise<User>`
	 */
	async findOneOrFail(
		where?: FindOptionsWhere<User> | FindOptionsWhere<User>[]
	) {
		try {
			const user = await this.userRepository.findOneOrFail({ where });

			return user;
		} catch (error) {
			const errors = await getFieldNotFoundException(
				this.userRepository,
				where
			);

			throw new NotFoundException(errors);
		}
	}

	/**
	 * Update an User by user's id
	 * * This method is using `findOneOrFail` method. So it can throw a `NotFoundException` when user was not found
	 * @param id User's id
	 * @param input UpdateUserDto { username, email, name }
	 * @returns `Promise<User>`
	 */
	async updateById(id: number, input: QueryDeepPartialEntity<User>) {
		await this.findOneOrFail({ id });

		await this.userRepository.update({ id }, input);

		return this.findOneOrFail({ id });
	}

	/**
	 * Remove an User by user's id.
	 * * This method is using `findOneOrFail` method. So it can throw a `NotFoundException` when user was not found
	 * @param id
	 * @returns `Promise<User>`
	 */
	async removeById(id: number) {
		const user = await this.findOneOrFail({ id });

		return this.userRepository.softRemove(user);
	}
}
