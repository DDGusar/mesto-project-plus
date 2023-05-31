import { ObjectId } from 'mongoose';
import { Request } from 'express';

export interface IRequestCustom extends Request {
  user?: {
    _id: string | ObjectId;
  };
}
