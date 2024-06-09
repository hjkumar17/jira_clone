import { Request } from 'express';

import { verifyToken } from 'utils/authToken';
import { catchErrors, InvalidTokenError } from 'errors';
import { User } from 'entities';
import { AppDataSource } from '../database/createConnection';

const userRepository = AppDataSource.getRepository(User);

export const authenticateUser = catchErrors(async (req, _res, next) => {
  const token = getAuthTokenFromRequest(req);
  if (!token) {
    throw new InvalidTokenError('Authentication token not found.');
  }
  const userId = verifyToken(token).sub;
  if (!userId) {
    throw new InvalidTokenError('Authentication token is invalid.');
  }
  const user = await userRepository.findOne({
    where: {
      id: userId,
    },
  });
  if (!user) {
    throw new InvalidTokenError('Authentication token is invalid: User not found.');
  }
  req.currentUser = user;
  next();
});

const getAuthTokenFromRequest = (req: Request): string | null => {
  const header = req.get('Authorization') || '';
  const [bearer, token] = header.split(' ');
  return bearer === 'Bearer' && token ? token : null;
};
