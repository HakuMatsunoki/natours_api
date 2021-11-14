import type { RequestHandler } from "express";

import { userNameHandler } from "../utils";
import { UserRoles, Messages, StatusCodes } from "../constants";
import { createUserValidator } from "../validators";

import { AppError } from "../utils";

export const isUserDataValid: RequestHandler = (req, _res, next) => {
  const { error } = createUserValidator.validate(req.body);

  if (!error) {
    req.body.role = UserRoles.USER;
    req.body.name = userNameHandler(req.body.name);

    return next();
  }

  const errorPath = error.details[0].path[0];

  return next(
    new AppError(Messages.INVALID_CREDS + errorPath, StatusCodes.BAD_REQUEST)
  );
};
