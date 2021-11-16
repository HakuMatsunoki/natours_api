import type { RequestHandler } from "express";
import crypto from "crypto";

import { RequestExt } from "../common";
import { Messages, StatusCodes, TokenNames } from "../constants";

import { User, UserDoc, Auth } from "../models";

import { generateJWTPair, JWTPair } from "../services";
import { catchAsync, AppError } from "../utils";

export const signup: RequestHandler = catchAsync(async (req, res, _next) => {
  const newUser: UserDoc = await User.create(req.body);

  newUser.passwd = undefined;
  newUser.active = undefined;
  const tokenPair: JWTPair = generateJWTPair(newUser.id);

  await Auth.create({ ...tokenPair, user: newUser.id });

  res.status(StatusCodes.OK).json({
    status: Messages.SUCCESS,
    user: newUser,
    tokenPair
  });
});

export const login: RequestHandler = catchAsync(
  async (req: RequestExt, res, _next) => {
    const user = req.user as UserDoc;
    const tokenPair: JWTPair = generateJWTPair(user.id);

    await Auth.create({ ...tokenPair, user: user.id });

    res.status(StatusCodes.OK).json({
      status: Messages.SUCCESS,
      user,
      tokenPair
    });
  }
);

export const logout: RequestHandler = catchAsync(async (req, res, _next) => {
  const accessToken: string | undefined = req.get(TokenNames.AUTH);

  await Auth.deleteOne({ accessToken });

  res.status(StatusCodes.OK).json({
    status: Messages.SUCCESS
  });
});

export const logoutAll: RequestHandler = catchAsync(
  async (req: RequestExt, res, _next) => {
    const user = req.user as UserDoc;

    await Auth.deleteMany({ user: user.id });

    res.status(StatusCodes.OK).json({
      status: Messages.SUCCESS
    });
  }
);

export const refresh: RequestHandler = catchAsync(
  async (req: RequestExt, res, _next) => {
    const refreshToken: string | undefined = req.get(TokenNames.AUTH);
    const user = req.user as UserDoc;
    const tokenPair: JWTPair = generateJWTPair(user.id);

    await Auth.updateOne({ refreshToken }, { ...tokenPair, user });

    res.status(StatusCodes.OK).json({
      status: Messages.SUCCESS,
      user,
      tokenPair
    });
  }
);

export const forgotPasswd: RequestHandler = catchAsync(
  async (req: RequestExt, res, _next) => {
    const user = req.user as UserDoc;
    const resetToken: string = user.createPasswdResetToken();

    await user.save({ validateBeforeSave: false });

    // send email notification

    res.status(StatusCodes.OK).json({
      status: Messages.SUCCESS,
      // remove
      resetToken
    });
  }
);

export const resetPasswd: RequestHandler = catchAsync(
  async (req, res, next) => {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user: UserDoc | null = await User.findOne({
      passwdResetToken: hashedToken,
      passwdResetExpires: { $gt: Date.now() }
    });

    if (!user)
      return next(
        new AppError(Messages.EXPIRED_TOKEN, StatusCodes.BAD_REQUEST)
      );

    user.passwd = req.body.passwd;
    user.passwdResetToken = undefined;
    user.passwdResetExpires = undefined;

    await user.save();
    await Auth.deleteMany({ user: user.id });

    res.status(StatusCodes.OK).json({
      status: Messages.SUCCESS
    });
  }
);
