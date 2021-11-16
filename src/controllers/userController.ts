import type { RequestHandler } from "express";

// import { RequestExt } from "../common";
import { Messages, StatusCodes } from "../constants";

import { User, UserDoc } from "../models";

import { catchAsync, AppError } from "../utils";

export const all: RequestHandler = catchAsync(async (_req, res, next) => {
  const users: Array<UserDoc> = await User.find();

  if (users.length === 0) return next(new AppError("bla", 404));

  res.status(StatusCodes.OK).json({
    status: Messages.SUCCESS,
    users
  });
});
