import express from 'express';
import { errors } from 'celebrate';
import mongoose from 'mongoose';
import userRouter from './routes/users';
import cardRouter from './routes/cards';
import authRouter from './routes/auth';
import errorHandler from './middleware/error';
import auth from './middleware/auth';
import { requestLogger, errorLogger } from './middleware/logger';
import ErrorCustom from './utils/errorCustom';
import MONGO_URL from './constants/urls';
import { NOT_FOUND } from './constants/statusCodes';

const { PORT = 3000 } = process.env;

const app = express();
app.use(express.json());
app.use(requestLogger);

mongoose.connect(MONGO_URL, {
  autoIndex: true,
  autoCreate: true,
});

app.use(authRouter);
app.use(auth);

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use('*', (req, res, next) => {
  next(new ErrorCustom('Страница не найдена', NOT_FOUND));
});

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT);
