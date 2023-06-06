import { Router } from 'express';
import {
  createCard,
  deleteCardById,
  dislikeCard,
  getCards,
  likeCard,
} from '../controllers/cards';
import {
  createCardValidation,
  getCardValidation,
} from '../validation/cardValidation';

const cardRouter = Router();

cardRouter.put('/:cardId/likes', getCardValidation, likeCard);

cardRouter.delete('/:cardId/likes', getCardValidation, dislikeCard);

cardRouter.delete('/:cardId', getCardValidation, deleteCardById);

cardRouter.get('/', getCards);

cardRouter.post('/', createCardValidation, createCard);

export default cardRouter;
