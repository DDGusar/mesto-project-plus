import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import ErrorCustom from '../utils/errorCustom';

const errorHandler = (
  err: ErrorCustom,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = err;
  if (err instanceof mongoose.Error.CastError) {
    const message = 'Невалидный _id';
    error = new ErrorCustom(message, 404);
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const message = 'Переданы некорректные данные';
    error = new ErrorCustom(message, 400);
  }
  res.status(error.statusCode || 500).json({
    message: error.message || 'Ошибка сервера',
  });
  next();
};
export default errorHandler;
