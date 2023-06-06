import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import ErrorCustom from '../utils/errorCustom';
import { UNAUTHORIZED } from '../constants/statusCodes';

export interface SessionRequest extends Request {
  user?: string | JwtPayload;
}

export default (req: SessionRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new ErrorCustom('Необходима авторизация', UNAUTHORIZED));
  } else {
    const token = authorization.replace('Bearer ', '');
    let payload;

    try {
      payload = jwt.verify(token, 'super-strong-secret');
    } catch (err) {
      throw new ErrorCustom('Необходима авторизация', UNAUTHORIZED);
    }

    req.user = payload as { _id: JwtPayload };
    next();
  }
};
