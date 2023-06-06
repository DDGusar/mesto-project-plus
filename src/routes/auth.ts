import { Router } from 'express';
import { login, createUser } from '../controllers/users';
import {
  createUserValidation,
  loginValidation,
} from '../validation/authValidation';

const authRouter = Router();

authRouter.post('/signin', loginValidation, login);
authRouter.post('/signup', createUserValidation, createUser);

export default authRouter;
