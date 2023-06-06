import { Request, Response, NextFunction } from 'express';
import { IRequestCustom } from '../types/types';
import Card from '../models/card';
import ErrorCustom from '../utils/errorCustom';
import {
  CREATE_OK,
  FORBIDDEN,
  NOT_FOUND,
  STATUS_OK,
} from '../constants/statusCodes';

export const getCards = (req: Request, res: Response, next: NextFunction) =>
  Card.find({})
    .then((cards) => res.status(STATUS_OK).send(cards))
    .catch(next);

export const createCard = (
  req: IRequestCustom,
  res: Response,
  next: NextFunction
) => {
  const { name, link } = req.body;
  return Card.create({ name, link, owner: req.user?._id })
    .then((card) => {
      res.status(CREATE_OK).send(card);
    })
    .catch(next);
};

export const deleteCardById = (
  req: IRequestCustom,
  res: Response,
  next: NextFunction
) => {
  const owner = req.user?._id;
  Card.findById(req.params.cardId)
    .orFail(
      () => new ErrorCustom('Карточка по указанному _id не найдена', NOT_FOUND)
    )
    .then((card) => {
      if (card.owner.toString() === owner) {
        card
          .deleteOne()
          .then(() =>
            res.status(STATUS_OK).send({ message: 'Карточка удалена' })
          );
      } else {
        throw new ErrorCustom('Нет прав для удаления карточки', FORBIDDEN);
      }
    })

    .catch(next);
};
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
    .orFail(
      () => new ErrorCustom('Карточка по указанному _id не найдена', NOT_FOUND)
    )
    .then((card) => res.status(STATUS_OK).send(card))
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
    .orFail(
      () => new ErrorCustom('Карточка по указанному _id не найдена', NOT_FOUND)
    )
    .then((card) => res.send(card))
    .catch(next);
