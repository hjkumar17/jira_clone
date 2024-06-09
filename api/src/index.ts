import 'module-alias/register';
import 'dotenv/config';
import 'reflect-metadata';
import express, { Application } from 'express';
import cors from 'cors';

import { AppDataSource } from 'database/createConnection';

import { addRespondToResponse } from 'middleware/response';
import { authenticateUser } from 'middleware/authentication';
import { handleError } from 'middleware/errors';
import { RouteNotFoundError } from 'errors';

import { attachPrivateRoutes, attachPublicRoutes } from './routes';

const establishDatabaseConnection = (): any => {
  console.log('connection start');
  AppDataSource.initialize()
    .then(() => {
      console.log('Inserting a new user into the database...');
      // const user = new User();
      // user.firstName = 'Timber';
      // user.lastName = 'Saw';
      // user.age = 25;
      // await AppDataSource.manager.save(user);
      // console.log(`Saved a new user with id:${user.id}`);

      // console.log('Loading users from the database...');
      // const users = await AppDataSource.manager.find(User);
      // console.log('Loaded users: ', users);

      console.log('Here you can setup and run express / fastify / any other framework.');
    })
    .catch(error => console.log('error223r', error));
  // console.log('connection');
};

const initializeExpress = (): void => {
  console.log('init');
  const app: Application = express();

  app.use(cors());

  app.use(express.json());
  app.use(express.urlencoded());

  app.use(addRespondToResponse);

  attachPublicRoutes(app);

  app.use('/', authenticateUser);

  attachPrivateRoutes(app);

  app.use((req, _res, next) => next(new RouteNotFoundError(req.originalUrl)));
  app.use(handleError);

  app.listen(process.env.PORT || 3000, () => {
    console.log(`Example app listening on port 3000`);
  });
};

const initializeApp = async (): Promise<void> => {
  await establishDatabaseConnection();
  initializeExpress();
};

initializeApp();
