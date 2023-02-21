require('dotenv').config({
	path: `.env.${process.env.NODE_ENV}`
});

import { DataSource, DataSourceOptions } from 'typeorm';

console.log(process.env.TYPEORM_USERNAME)

const ormConfig: DataSourceOptions = {
	type: 'mysql',
	host: process.env.TYPEORM_HOST,
	port: +process.env.TYPEORM_PORT,
	username: process.env.TYPEORM_USERNAME,
	password: process.env.TYPEORM_PASSWORD,
	database: process.env.TYPEORM_DATABASE_NAME,
	entities: [__dirname + '/src/app/**/*.entity.{js,ts}'],
	migrations: [__dirname + '/src/database/migrations/*.{js,ts}'],
	migrationsTableName: 'migrations',
	synchronize: process.env.NODE_ENV === 'development'
};

export default new DataSource(ormConfig);
