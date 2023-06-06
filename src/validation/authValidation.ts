import { celebrate, Joi } from 'celebrate';
import pictureRegExp from '../constants/regExpressions';

export const loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

export const createUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().pattern(pictureRegExp),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});
