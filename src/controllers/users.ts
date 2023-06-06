import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IRequestCustom } from '../types/types';
import User from '../models/user';
import ErrorCustom from '../utils/errorCustom';
import {
  CONFLICT,
  CREATE_OK,
  NOT_FOUND,
  STATUS_OK,
} from '../constants/statusCodes';

export const getUsers = (req: Request, res: Response, next: NextFunction) =>
  User.find({})
    .then((users) => res.status(STATUS_OK).send(users))
    .catch(next);

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash: String) =>
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
    )
    .then((user) => {
      res.status(CREATE_OK).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        res
          .status(CONFLICT)
          .send({ message: 'Пользователь с данным email уже существует' });
      } else {
        next(err);
      }
    });
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, 'super-strong-secret', {
          expiresIn: '7d',
        }),
      });
    })
    .catch(next);
};

export const getUserById = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  return User.findById(id)
    .orFail(
      () =>
        new ErrorCustom('Пользователь по указанному _id не найден', NOT_FOUND)
    )
    .then((user) => res.status(STATUS_OK).send(user))
    .catch(next);
};

export const getCurrentUser = (
  req: IRequestCustom,
  res: Response,
  next: NextFunction
) =>
  User.findById(req.user?._id)
    .orFail(
      () =>
        new ErrorCustom('Пользователь по указанному _id не найден', NOT_FOUND)
    )
    .then((user) => res.status(STATUS_OK).send(user))
    .catch(next);

export const updateProfile = (
  req: IRequestCustom,
  res: Response,
  next: NextFunction
) => {
  const { name, about } = req.body;
  return User.findByIdAndUpdate(
    req.user?._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .orFail(
      () =>
        new ErrorCustom('Пользователь по указанному _id не найден', NOT_FOUND)
    )
    .then((user) => res.status(STATUS_OK).send(user))
    .catch(next);
};

export const updateAvatar = (
  req: IRequestCustom,
  res: Response,
  next: NextFunction
) => {
  const { avatar } = req.body;
  return User.findByIdAndUpdate(
    req.user?._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .orFail(
      () =>
        new ErrorCustom('Пользователь по указанному _id не найден', NOT_FOUND)
    )
    .then((user) => res.status(STATUS_OK).send(user))
    .catch(next);
};
