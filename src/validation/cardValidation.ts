import { celebrate, Joi } from 'celebrate';
import pictureRegExp from '../constants/regExpressions';

export const createCardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().pattern(pictureRegExp).required(),
  }),
});

export const getCardValidation = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
});
