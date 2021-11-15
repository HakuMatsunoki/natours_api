import { RequestHandler } from "express";
import { JwtPayload } from "jsonwebtoken";

import { RequestExt } from "../common";
import { UserRoles, Messages, StatusCodes, TokenNames } from "../constants";
import { Auth, AuthObject, User, UserObject } from "../models";
import { verifyToken } from "../services";
import { AppError, catchAsync, userNameHandler } from "../utils";
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

export const isNotEmailExist: RequestHandler = catchAsync(
  async (req, _res, next) => {
    const { email } = req.body;

    const userExist: boolean = !!(await User.findOne({ email }));

    if (userExist)
      return next(
        new AppError(Messages.DUPLICATED_ACCOUNT, StatusCodes.CONFLICT)
      );

    next();
  }
);

export const isAuthenticated: RequestHandler = catchAsync(
  async (req: RequestExt, _res, next) => {
    const { passwd, email } = req.body;
    const { error } = emailValidator.validate({ email, passwd });

    if (error)
      return next(new AppError(Messages.INVALID_AUTH, StatusCodes.BAD_REQUEST));

    const user: UserObject | null = await User.findOne({ email }).select(
      "+passwd"
    );

    if (!user || !(await user.checkPasswd(passwd))) {
      return next(new AppError(Messages.INVALID_AUTH, StatusCodes.UNAUTH));
    }

    user.passwd = undefined;
    req.user = user;

    next();
  }
);

export const protectRoute: RequestHandler = catchAsync(
  async (req: RequestExt, _res, next) => {
    const accessToken: string | undefined = req.get(TokenNames.AUTH);

    if (!accessToken)
      return next(new AppError(Messages.INVALID_TOKEN, StatusCodes.UNAUTH));

    const { id } = verifyToken(accessToken) as JwtPayload;

    const authObject: AuthObject = await Auth.findOne({
      accessToken
    }).populate("user");

    const userObject = authObject?.user as UserObject | void;

    if (!id || !userObject || userObject.id !== id)
      return next(new AppError(Messages.INVALID_TOKEN, StatusCodes.UNAUTH));

    req.user = userObject;

    next();
  }
);

export const checkRefresh: RequestHandler = catchAsync(
  async (req: RequestExt, _res, next) => {
    const refreshToken: string | undefined = req.get(TokenNames.AUTH);

    if (!refreshToken)
      return next(new AppError(Messages.INVALID_TOKEN, StatusCodes.UNAUTH));

    const { id } = verifyToken(refreshToken, false) as JwtPayload;

    const authObject: AuthObject | null = await Auth.findOne({
      refreshToken
    }).populate("user");

    const userObject = authObject?.user as UserObject | void;

    if (!id || !userObject || userObject.id !== id)
      return next(new AppError(Messages.INVALID_TOKEN, StatusCodes.UNAUTH));

    req.user = userObject;

    next();
  }
);
