import type { RequestHandler } from "express";

// import { JWTPair } from "../common";

import { StatusCodes } from "../constants";

import { User, Auth } from "../models";

import { generateJWTPair } from "../services";
import { catchAsync } from "../utils";

export const signup: RequestHandler = catchAsync(async (req, res, _next) => {
  const newUser = await User.create(req.body);

  const { accessToken, refreshToken } = generateJWTPair(newUser.id);

  await Auth.create({
    accessToken,
    refreshToken,
    user: newUser.id
  });

  res.status(StatusCodes.OK).json({
    status: "success",
    user: newUser,
    tokenPair: {
      accessToken,
      refreshToken
    }
  });
});
