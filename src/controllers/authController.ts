import type { RequestHandler } from "express";
// import { ControllerFn } from "../common";
import { AppError, catchAsync } from "../utils";

import { User } from "../models/userModel.js";

export const signup: RequestHandler = catchAsync(async (req, res, next) => {
  const { name, email, passwd, passwdConfirm } = req.body;

  if (passwd !== passwdConfirm) return next(new AppError("wrong pass", 400));

  const newUser = await User.create({
    name,
    email,
    passwd
  });

  if (!newUser) return next(new AppError("no user", 400));

  // const url = `${req.protocol}://${req.get("host")}/me`;
  // console.log(url);

  // await new Email(newUser, url).sendWelcome();

  // createSentToken(newUser, 201, req, res);

  res.status(200).json({
    status: "success",
    user: newUser
  });
});
