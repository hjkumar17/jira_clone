import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as entities from '../entities';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true,
  logging: false,
  entities: Object.values(entities),
  migrations: [],
  subscribers: [],
});
