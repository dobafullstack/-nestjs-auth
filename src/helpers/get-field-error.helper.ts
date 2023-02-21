import { BaseEntity, FindOptionsWhere, Repository } from 'typeorm';

export async function getFieldNotFoundException<T extends BaseEntity>(
	repository: Repository<T>,
	where: FindOptionsWhere<T> | FindOptionsWhere<T>[]
) {
	const errors: { field: string; message: string }[] = [];

	const keys: string[] = [];
	const values: string[] = [];

	if (Array.isArray(where)) {
		where.forEach((w) => {
			Object.keys(w).forEach((item) => keys.push(item));
			Object.values(w).forEach((item) => values.push(item));
		});
	} else {
		Object.keys(where).forEach((item) => keys.push(item));
		Object.values(where).forEach((item) => values.push(item));
	}

	for (let i = 0; i < keys.length; i++) {
		const key = keys[i];
		const value = values[i];

		//@ts-ignore
		const entity = await repository.findOne({ where: { [key]: value } });

		if (!entity) {
			errors.push({
				field: key,
				message: `Can not find entity with ${key} = ${value}`
			});
		}
	}

	return errors;
}

export function getFieldConflictException<T extends BaseEntity>(
	entity: T,
	where: FindOptionsWhere<T> | FindOptionsWhere<T>[]
) {
	const errors: { field: string; message: string }[] = [];

	const keys: string[] = [];
	const values: string[] = [];

	if (Array.isArray(where)) {
		where.forEach((w) => {
			Object.keys(w).forEach((item) => keys.push(item));
			Object.values(w).forEach((item) => values.push(item));
		});
	} else {
		Object.keys(where).forEach((item) => keys.push(item));
		Object.values(where).forEach((item) => values.push(item));
	}

	for (let i = 0; i < keys.length; i++) {
		const key = keys[i];
		const value = values[i];

		if (entity[key] === value) {
			errors.push({
				field: key,
				message: `${key} has already exist`
			});
		}
	}

	return errors;
}
