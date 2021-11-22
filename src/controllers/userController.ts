import type { RequestHandler } from "express";

import { RequestExt } from "../common";
import { Messages, StatusCodes } from "../constants";

import { User, UserDoc } from "../models";

import * as factory from "./handlerFactory";
import { catchAsync } from "../utils";

export const getAllUsers: RequestHandler = factory.getAll(User);
export const getUser: RequestHandler = factory.getOne(User);
export const updateUser: RequestHandler = factory.updateOne(User);
export const deleteUser: RequestHandler = factory.deleteOne(User);

export const getMe: RequestHandler = (req: RequestExt, res, _next) => {
  const user = req.user as UserDoc;

  res.status(StatusCodes.OK).json({
    status: Messages.SUCCESS,
    user
  });
};

export const updateMe: RequestHandler = catchAsync(
  async (req: RequestExt, res, next) => {
    // TODO:
  }
);

export const deleteMe: RequestHandler = catchAsync(
  async (req: RequestExt, res, _next) => {
    const { id } = req.user as UserDoc;

    await User.findByIdAndUpdate(id, { active: false });

    res.status(StatusCodes.NO_CONTENT).json({
      status: Messages.SUCCESS,
      data: null
    });
  }
);
