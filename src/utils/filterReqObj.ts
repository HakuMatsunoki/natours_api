import * as Joi from "joi";

import { JoiValidatorsObj, UnknownObj } from "../common";
import { Messages, StatusCodes } from "../constants";
import { AppError } from "../utils";

export const softValidator = (
  obj: UnknownObj,
  allowedFields: string[],
  validators: JoiValidatorsObj
): UnknownObj => {
  const options: JoiValidatorsObj = {};

  Object.keys(obj).forEach((item) => {
    if (item in validators && allowedFields.includes(item)) options[item] = validators[item];
  });

  const validated = Joi.object(options).validate(obj);

  if (validated.error)
    throw new AppError(
      Messages.INVALID_CREDS + validated.error.details[0].message,
      StatusCodes.BAD_REQUEST
    );

  return { ...validated.value };
};
