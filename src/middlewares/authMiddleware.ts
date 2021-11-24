import { RequestHandler } from "express";
import { JwtPayload } from "jsonwebtoken";

import { RequestExt } from "../common";
import { UserRoles, Messages, StatusCodes, TokenNames } from "../constants";
import { Auth, AuthObject, User, UserDoc } from "../models";
import { verifyToken } from "../services";
import { AppError, catchAsync, userNameHandler } from "../utils";
import {
  createUserValidator,
  loginValidator,
  emailValidator,
  passwdValidator
} from "../validators";

export const isUserDataValid: RequestHandler = (req, _res, next) => {
  // TODO: validators issue
  const { error } = createUserValidator.validate(req.body);

  if (error)
    return next(
      new AppError(Messages.INVALID_CREDS + error.details[0].message, StatusCodes.BAD_REQUEST)
    );

  req.body.role = UserRoles.USER;
  req.body.name = userNameHandler(req.body.name);

  next();
};

export const isNotEmailExist: RequestHandler = catchAsync(async (req, _res, next) => {
  const { email } = req.body;

  const userExist: boolean = !!(await User.findOne({ email }));

  if (userExist) return next(new AppError(Messages.DUPLICATED_ACCOUNT, StatusCodes.CONFLICT));

  next();
});

export const isPasswdValid: RequestHandler = (req, _res, next) => {
  // TODO: validators issue
  const { error } = passwdValidator.validate(req.body);

  if (error) return next(new AppError(Messages.INVALID_PASSWD, StatusCodes.BAD_REQUEST));

  next();
};

export const isAccountExist: RequestHandler = catchAsync(async (req: RequestExt, _res, next) => {
  // TODO: validators issue
  const { error } = emailValidator.validate(req.body);

  if (error) return next(new AppError(Messages.INVALID_EMAIL, StatusCodes.BAD_REQUEST));

  const user: UserDoc | null = await User.findOne({
    email: req.body.email
  });

  if (!user) return next(new AppError(Messages.NO_USER, StatusCodes.NOT_FOUND));

  req.user = user;

  next();
});

export const isAuthenticated: RequestHandler = catchAsync(async (req: RequestExt, _res, next) => {
  // TODO: validators issue
  const { error } = loginValidator.validate(req.body);

  if (error) return next(new AppError(Messages.INVALID_AUTH, StatusCodes.BAD_REQUEST));

  const { passwd, email } = req.body;

  const user: UserDoc | null = await User.findOne({ email }).select("+passwd");

  if (!user || !(await user.checkPasswd(passwd))) {
    return next(new AppError(Messages.INVALID_AUTH, StatusCodes.UNAUTH));
  }

  user.passwd = undefined;
  req.user = user;

  next();
});

export const protectRoute: RequestHandler = catchAsync(async (req: RequestExt, _res, next) => {
  const accessToken: string | undefined = req.get(TokenNames.AUTH);

  if (!accessToken) return next(new AppError(Messages.INVALID_TOKEN, StatusCodes.UNAUTH));

  const decoded = verifyToken(accessToken) as JwtPayload;

  const authObject: AuthObject = await Auth.findOne({
    accessToken
  }).populate("user");

  const currentUser = authObject?.user as UserDoc | void;

  if (!decoded.id || !decoded.iat || !currentUser || currentUser.id !== decoded.id)
    return next(new AppError(Messages.INVALID_TOKEN, StatusCodes.UNAUTH));

  // maybe not necessary
  if (currentUser.changedPasswdAfter(decoded.iat))
    return next(new AppError("User recenty changed password! Please log in again.", 401));

  req.user = currentUser;

  next();
});

export const checkRefresh: RequestHandler = catchAsync(async (req: RequestExt, _res, next) => {
  const refreshToken: string | undefined = req.get(TokenNames.AUTH);

  if (!refreshToken) return next(new AppError(Messages.INVALID_TOKEN, StatusCodes.UNAUTH));

  const { id } = verifyToken(refreshToken, false) as JwtPayload;

  const authObject: AuthObject | null = await Auth.findOne({
    refreshToken
  }).populate("user");

  const userObject = authObject?.user as UserDoc | void;

  if (!id || !userObject || userObject.id !== id)
    return next(new AppError(Messages.INVALID_TOKEN, StatusCodes.UNAUTH));

  req.user = userObject;

  next();
});

export const restrictTo =
  (...userRoles: Array<string>): RequestHandler =>
  (req: RequestExt, _res, next) => {
    const user = req.user as UserDoc;

    if (!userRoles.includes(user.role))
      return next(new AppError(Messages.NOT_ALLOWED, StatusCodes.NOT_ALLOWED));

    next();
  };
