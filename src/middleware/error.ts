import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import ErrorCustom from '../utils/errorCustom';
import { INVALID_DATA, SERVER_ERROR } from '../constants/statusCodes';

const errorHandler = (
  err: ErrorCustom,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = err;
  if (err instanceof mongoose.Error.CastError) {
    const message = 'Невалидный _id';
    error = new ErrorCustom(message, INVALID_DATA);
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const message = 'Переданы некорректные данные';
    error = new ErrorCustom(message, INVALID_DATA);
  }
  res.status(error.statusCode || SERVER_ERROR).json({
    message: error.message || 'Ошибка сервера',
  });
  next();
};
export default errorHandler;
