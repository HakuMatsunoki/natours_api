import * as Joi from "joi";

import type { JoiValidatorsObj } from "../common";
import { regexp } from "../configs";
import { UserFields } from "../constants";

export const userRegularValidators: JoiValidatorsObj = {
  [UserFields.NAME]: Joi.string().regex(regexp.NAME).trim(),
  [UserFields.EMAIL]: Joi.string().regex(regexp.EMAIL).trim()
};

export const userRequiredValidators: JoiValidatorsObj = {
  [UserFields.NAME]: Joi.string().regex(regexp.NAME).trim().required(),
  [UserFields.EMAIL]: Joi.string().regex(regexp.EMAIL).trim().required(),
  [UserFields.PASSWD]: Joi.string().regex(regexp.PASSWD).trim().required()
};

export const userLoginValidators: JoiValidatorsObj = {
  [UserFields.EMAIL]: Joi.string().regex(regexp.EMAIL).trim().required(),
  [UserFields.PASSWD]: Joi.string().trim().required()
};
