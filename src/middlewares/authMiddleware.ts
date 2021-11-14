import type { RequestHandler } from "express";

import { RequestExt } from "../common";
import { UserRoles, Messages, StatusCodes } from "../constants";
import { User, UserObj } from "../models";
import { AppError, userNameHandler } from "../utils";
import { createUserValidator, emailValidator } from "../validators";

export const isUserDataValid: RequestHandler = (req, _res, next) => {
  const { error } = createUserValidator.validate(req.body);

  if (error) {
    const errorPath: string | number = error.details[0].path[0];

    return next(
      new AppError(Messages.INVALID_CREDS + errorPath, StatusCodes.BAD_REQUEST)
    );
  }

  req.body.role = UserRoles.USER;
  req.body.name = userNameHandler(req.body.name);

  next();
};

export const isNotEmailExist: RequestHandler = async (req, _res, next) => {
  const { email } = req.body;

  const userExist: boolean = !!(await User.findOne({ email }));

  if (userExist)
    return next(
      new AppError(Messages.DUPLICATED_ACCOUNT, StatusCodes.CONFLICT)
    );

  next();
};

export const isAuthenticated: RequestHandler = async (
  req: RequestExt,
  _res,
  next
) => {
  const { passwd, email } = req.body;
  const { error } = emailValidator.validate({ email, passwd });

  if (error)
    return next(new AppError(Messages.INVALID_AUTH, StatusCodes.BAD_REQUEST));

  const user: UserObj | null = await User.findOne({ email }).select("+passwd");

  if (!user || !(await user.checkPasswd(passwd))) {
    return next(new AppError(Messages.INVALID_AUTH, StatusCodes.UNAUTH));
  }

  user.passwd = undefined;
  req.user = user;

  next();
};
