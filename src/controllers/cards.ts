import { Request, Response, NextFunction } from 'express';
import { IRequestCustom } from '../types/types';
import Card from '../models/card';

export const getCards = (req: Request, res: Response, next: NextFunction) =>
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(next);

export const createCard = async (
  req: IRequestCustom,
  res: Response,
  next: NextFunction
) => {
  const { name, link } = req.body;
  const id = req.user?._id;
  const newCard = await Card.create({ name, link, owner: id });
  return newCard
    .populate('owner')
    .then((card) => res.status(201).send(card))
    .catch(next);
};

export const deleteCardById = (
  req: Request,
  res: Response,
  next: NextFunction
) =>
  Card.findByIdAndDelete(req.params.cardId)
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
    .then((card) => res.send(card))
    .catch(next);
