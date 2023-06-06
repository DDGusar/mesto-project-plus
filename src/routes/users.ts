import { Router } from 'express';
import {
  getUsers,
  getUserById,
  getCurrentUser,
  updateProfile,
  updateAvatar,
} from '../controllers/users';
import {
  getUserByIdValidation,
  updateAvatarValidation,
  updateProfileValidation,
} from '../validation/userValidation';

const userRouter = Router();

userRouter.patch('/me/avatar', updateAvatarValidation, updateAvatar);

userRouter.patch('/me', updateProfileValidation, updateProfile);

userRouter.get('/me', getCurrentUser);

userRouter.get('/:id', getUserByIdValidation, getUserById);

userRouter.get('/', getUsers);

export default userRouter;
