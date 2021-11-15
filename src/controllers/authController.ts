import type { RequestHandler } from "express";

import { RequestExt } from "../common";
import { Messages, StatusCodes, TokenNames } from "../constants";

import { User, UserObject, Auth } from "../models";

import { generateJWTPair, JWTPair } from "../services";
import { catchAsync } from "../utils";

export const signup: RequestHandler = catchAsync(async (req, res, _next) => {
  const newUser: UserObject = await User.create(req.body);

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
    const user = req.user as UserObject;
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

export const refresh: RequestHandler = catchAsync(
  async (req: RequestExt, res, _next) => {
    const refreshToken: string | undefined = req.get(TokenNames.AUTH);
    const user = req.user as UserObject;
    const tokenPair: JWTPair = generateJWTPair(user.id);

    await Auth.updateOne({ refreshToken }, { ...tokenPair, user });

    res.status(StatusCodes.OK).json({
      status: Messages.SUCCESS,
      user,
      tokenPair
    });
  }
);
