import type { RequestHandler } from "express";

import { RequestExt } from "../common";
import { StatusCodes } from "../constants";

import { User, UserObj, Auth } from "../models";

import { generateJWTPair, JWTPair } from "../services";
import { catchAsync } from "../utils";

export const signup: RequestHandler = catchAsync(async (req, res, _next) => {
  const newUser = await User.create(req.body);

  newUser.passwd = undefined;
  newUser.active = undefined;
  const tokenPair: JWTPair = generateJWTPair(newUser.id);

  await Auth.create({
    ...tokenPair,
    user: newUser.id
  });

  res.status(StatusCodes.OK).json({
    status: "success",
    user: newUser,
    tokenPair
  });
});

export const login: RequestHandler = catchAsync(
  async (req: RequestExt, res, _next) => {
    const user = req.user as UserObj;
    const tokenPair: JWTPair = generateJWTPair(user.id);

    await Auth.create({
      ...tokenPair,
      user: user.id
    });

    res.status(StatusCodes.OK).json({
      status: "success",
      user,
      tokenPair
    });
  }
);
