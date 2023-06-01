import { Request, Response, NextFunction } from 'express';
import { IRequestCustom } from '../types/types';
import Card from '../models/card';
import ErrorCustom from '../utils/errorCustom';

export const getCards = (req: Request, res: Response, next: NextFunction) =>
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(next);

export const createCard = (
  req: IRequestCustom,
  res: Response,
  next: NextFunction
) => {
  const { name, link } = req.body;
  return Card.create({ name, link, owner: req.user?._id })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch(next);
};

export const deleteCardById = (
  req: Request,
  res: Response,
  next: NextFunction
) =>
  Card.findByIdAndDelete(req.params.cardId)
    .orFail(() => new ErrorCustom('Карточка по указанному _id не найдена', 404))
    .then(() => res.status(200).send({ message: 'Карточка удалена' }))
    .catch(next);

export const likeCard = (
  req: IRequestCustom,
  res: Response,
  next: NextFunction
) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user?._id } },
    { new: true }
  )
    .populate(['owner', 'likes'])
    .orFail(() => new ErrorCustom('Карточка по указанному _id не найдена', 404))
    .then((card) => res.status(200).send(card))
    .catch(next);

export const dislikeCard = (
  req: IRequestCustom,
  res: Response,
  next: NextFunction
) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user?._id } },
    { new: true }
  )
    .populate(['owner', 'likes'])
    .orFail(() => new ErrorCustom('Карточка по указанному _id не найдена', 404))
    .then((card) => res.send(card))
    .catch(next);
