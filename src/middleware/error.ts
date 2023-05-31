import { Request, Response, NextFunction } from 'express';
import ErrorCastom from '../utils/errorCastom';

const errorHandler = (
  err: ErrorCastom,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err };
  if (err.name === 'CastError') {
    const message = 'Пользователь или карточка не найдены';
    error = new ErrorCastom(message, 404);
  }
  if (err.name === 'ValidationError') {
    const message = 'Переданы некорректные данные';
    error = new ErrorCastom(message, 400);
  }
  res.status(error.statusCode || 500).json({
    message: error.message || 'Ошибка сервера',
  });
  next();
};
export default errorHandler;
