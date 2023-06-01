import { Response, NextFunction } from 'express';
import { IRequestCustom } from '../types/types';

const userAuth = (
  req: IRequestCustom,
  res: Response,
  next: NextFunction
) => {
  req.user = {
    _id: '6475d86e93d8c536f28ee563',
  };
  next();
};

export default userAuth;
