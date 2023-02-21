import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import dataSource from 'ormconfig';
import { providers } from 'src/app.provider';
import { User } from 'src/app/user/user.entity';
import { UserService } from 'src/app/user/user.service';
import { generateString } from 'src/helpers/generate-string.helper';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AuthController (e2e)', () => {
	let app: INestApplication;
	const userService = new UserService(dataSource.getRepository(User));

	let username;
	let email;
	let password;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule]
		}).compile();

		app = moduleFixture.createNestApplication();

		app.setGlobalPrefix('api');

		await app.init();
	});

	beforeEach(async () => {
		username = generateString(6);
		email = generateString(6) + '@gmail.com';
		password = generateString(6);

		const existingUser = await userService.findOne({
			username
		});
		if (existingUser) await userService.removeById(existingUser.id);
	});

	describe('/api/auth/register (POST)', () => {
		describe('[VALIDATION]', () => {
			describe('username', () => {
				it('should throw bad request exception when username is null', () => {
					return request(app.getHttpServer())
						.post('/api/auth/register')
						.send({
							email,
							password
						})
						.expect(400)
						.then((res) => {
							const { errors } = res.body;

							expect(errors[0].field).toEqual('username');
						});
				});

				it('should throw bad request exception when username is not string', () => {
					return request(app.getHttpServer())
						.post('/api/auth/register')
						.send({
							username: 123123132,
							email,
							password
						})
						.expect(400)
						.then((res) => {
							const { errors } = res.body;

							expect(errors[0].field).toEqual('username');
						});
				});
			});

			describe('password', () => {
				it('should throw bad request exception when password is null', () => {
					return request(app.getHttpServer())
						.post('/api/auth/register')
						.send({
							username,
							email
						})
						.expect(400)
						.then((res) => {
							const { errors } = res.body;

							expect(errors[0].field).toEqual('password');
						});
				});

				it('should throw bad request exception when password is not string', () => {
					return request(app.getHttpServer())
						.post('/api/auth/register')
						.send({
							username,
							email,
							password: 123213123123
						})
						.expect(400)
						.then((res) => {
							const { errors } = res.body;

							expect(errors[0].field).toEqual('password');
						});
				});
			});

			describe('email', () => {
				it('should throw bad request exception when email is null', () => {
					return request(app.getHttpServer())
						.post('/api/auth/register')
						.send({
							username,
							password
						})
						.expect(400)
						.then((res) => {
							const { errors } = res.body;

							expect(errors[0].field).toEqual('email');
						});
				});

				it('should throw bad request exception when email is invalid', () => {
					return request(app.getHttpServer())
						.post('/api/auth/register')
						.send({
							username,
							password,
							email: 'email'
						})
						.expect(400)
						.then((res) => {
							const { errors } = res.body;

							expect(errors[0].field).toEqual('email');
						});
				});
			});
		});

		describe('[EXCEPTION]', () => {
			it('should throw conflict exception when user already exists', async () => {
				await userService.create({
					username,
					email,
					password,
					roles: []
				});

				return request(app.getHttpServer())
					.post('/api/auth/register')
					.send({ username, email, password })
					.expect(409);
			});
		});

		describe('[MAIN]', () => {
			it('should create new user', async () => {
				return request(app.getHttpServer())
					.post('/api/auth/register')
					.send({ username, email, password })
					.expect(201)
					.then((res) => {
						const { data } = res.body;
						console.log(res.body);

						expect(data.username).toEqual(username);
						expect(data.email).toEqual(email);
					});
			});
		});
	});

	describe('/api/auth/login (POST)', () => {
		describe('[VALIDATION]', () => {
			describe('usernameOrEmail', () => {
				it('should throw bad request exception when usernameOrEmail is null', () => {
					return request(app.getHttpServer())
						.post('/api/auth/login')
						.send({
							password
						})
						.expect(400)
						.then((res) => {
							const { errors } = res.body;

							expect(errors[0].field).toEqual('usernameOrEmail');
						});
				});

				it('should throw bad request exception when username is not string', () => {
					return request(app.getHttpServer())
						.post('/api/auth/login')
						.send({
							username: 123123132,
							password
						})
						.expect(400)
						.then((res) => {
							const { errors } = res.body;

							expect(errors[0].field).toEqual('usernameOrEmail');
						});
				});
			});

			describe('password', () => {
				it('should throw bad request exception when password is null', () => {
					return request(app.getHttpServer())
						.post('/api/auth/login')
						.send({
							usernameOrEmail: username
						})
						.expect(400)
						.then((res) => {
							const { errors } = res.body;

							expect(errors[0].field).toEqual('password');
						});
				});

				it('should throw bad request exception when password is not string', () => {
					return request(app.getHttpServer())
						.post('/api/auth/login')
						.send({
							usernameOrEmail: username,
							password: 123213123123
						})
						.expect(400)
						.then((res) => {
							const { errors } = res.body;

							expect(errors[0].field).toEqual('password');
						});
				});
			});
		});

		describe('[EXCEPTION]', () => {
			it('should throw not found exception when user not be found', async () => {
				const users = await userService.findOne({ username: 'test' });

				if (users) await userService.removeById(users.id);

				return request(app.getHttpServer())
					.post('/api/auth/login')
					.send({ usernameOrEmail: 'test', password })
					.expect(404);
			});
		});

		describe('[MAIN]', () => {
			it('should return a new token', async () => {
				await userService.create({
					username,
					email,
					password,
					roles: []
				});

				return request(app.getHttpServer())
					.post('/api/auth/login')
					.send({ usernameOrEmail: username, password })
					.expect(200)
					.then((res) => {
						const { data } = res.body;

						expect(data.accessToken).toBeDefined();
						expect(data.expires_in).toBeDefined();
					});
			});
		});
	});
});
