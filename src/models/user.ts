import mongoose, { Schema, Model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import ErrorCustom from '../utils/errorCustom';
import pictureRegExp from '../constants/regExpressions';
import { UNAUTHORIZED } from '../constants/statusCodes';

interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

interface IUserModel extends Model<IUser> {
  findUserByCredentials: (
    // eslint-disable-next-line no-unused-vars
    email: string,
    // eslint-disable-next-line no-unused-vars
    password: string
  ) => Promise<Document<unknown, any, IUser>>;
}

const userSchema = new Schema<IUser, IUserModel>({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v: string) => validator.isEmail(v),
      message: 'Неверный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default:
      'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (v: string) => pictureRegExp.test(v),
      message: 'Неверный формат ссылки',
    },
  },
});

userSchema.static(
  'findUserByCredentials',
  function findUserByCredentials(email: string, password: string) {
    return this.findOne({ email })
      .select('+password')
      .then((user) => {
        if (!user) {
          return Promise.reject(
            new ErrorCustom('Неправильные почта или пароль', UNAUTHORIZED)
          );
        }

        return bcrypt.compare(password, user.password).then((matched) => {
          if (!matched) {
            return Promise.reject(
              new ErrorCustom('Неправильные почта или пароль', UNAUTHORIZED)
            );
          }
          return user;
        });
      });
  }
);

export default mongoose.model<IUser, IUserModel>('user', userSchema);
