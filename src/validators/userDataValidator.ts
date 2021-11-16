import * as Joi from "joi";

import { regexp } from "../configs";

export const createUserValidator = Joi.object({
  name: Joi.string().regex(regexp.NAME).trim().required(),
  email: Joi.string().regex(regexp.EMAIL).trim().required(),
  passwd: Joi.string().regex(regexp.PASSWD).trim().required()
});

export const loginValidator = Joi.object({
  email: Joi.string().regex(regexp.EMAIL).trim().required(),
  passwd: Joi.string().trim().required()
});

export const emailValidator = Joi.object({
  email: Joi.string().regex(regexp.EMAIL).trim().required()
});

export const passwdValidator = Joi.object({
  passwd: Joi.string().regex(regexp.PASSWD).trim().required()
});
