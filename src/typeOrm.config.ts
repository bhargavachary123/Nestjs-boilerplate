import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config()

export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST ?? '127.0.0.1',
  port: parseInt(process.env.DB_PORT) ?? 3306,
  username: process.env.DB_USERNAME ?? 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*.ts'],
  migrationsRun: true,
});