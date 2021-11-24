import * as Joi from "joi";

import { JoiValidatorsObj } from "../common";
import { regexp } from "../configs";
import { UserFields } from "../constants";

export const userReqValidators: JoiValidatorsObj = {
  [UserFields.NAME]: Joi.string().regex(regexp.NAME).trim(),
  [UserFields.EMAIL]: Joi.string().regex(regexp.EMAIL).trim()
};
