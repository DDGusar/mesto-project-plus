import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/users';
import cardRouter from './routes/cards';
import errorHandler from './middleware/error';
import userAuth from './middleware/userAuth';

const { PORT = 3000 } = process.env;

const app = express();
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  autoIndex: true,
  autoCreate: true,
});

app.use(userAuth);

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use(errorHandler);

app.listen(PORT);
