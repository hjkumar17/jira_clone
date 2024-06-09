import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as entities from '../entities';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'Postgres@24',
  database: 'jira_development',
  synchronize: true,
  logging: false,
  entities: Object.values(entities),
  migrations: [],
  subscribers: [],
});
