import * as argon2 from 'argon2';
import { Exclude, Transform } from 'class-transformer';
import {
	BaseEntity,
	BeforeInsert,
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	JoinTable,
	ManyToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm';
import { Role } from '../role/role.entity';

@Entity()
export class User extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	username: string;

	@Column()
	email: string;

	@Column()
	@Exclude()
	password: string;

	@Column({ nullable: true })
	name: string;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	@DeleteDateColumn()
	deleted_at: Date;

	@ManyToMany(() => Role)
	@JoinTable({
		name: 'user_role',
		joinColumn: {
			name: 'user_id'
		},
		inverseJoinColumn: {
			name: 'role_id'
		}
	})
	@Transform(({ value }) => value.map(item => item.name))
	roles: Role[];

	@BeforeInsert()
	async hashPassword() {
		this.password = await argon2.hash(this.password);
	}
}
