import { NextFunction, Request, Response } from 'express';
import { IRequestCustom } from '../types/types';
import User from '../models/user';

export const getUsers = (req: Request, res: Response, next: NextFunction) =>
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(next);

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body;
  return User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch(next);
};

export const getUserById = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  return User.findById(id)
    .then((user) => res.status(200).send(user))
    .catch(next);
};

export const updateProfile = (
  req: IRequestCustom,
  res: Response,
  next: NextFunction
) => {
  const { name, about } = req.body;
  return User.findByIdAndUpdate(req.user?._id, { name, about }, { new: true })
    .then((user) => res.status(200).send(user))
    .catch(next);
};

export const updateAvatar = (
  req: IRequestCustom,
  res: Response,
  next: NextFunction
) => {
  const { avatar } = req.body;
  return User.findByIdAndUpdate(req.user?._id, { avatar }, { new: true })
    .then((user) => res.status(200).send(user))
    .catch(next);
};