import type { RequestHandler } from "express";
// import { ControllerFn } from "../common";
import { AppError, catchAsync } from "../utils";

export const signin: RequestHandler = catchAsync((_req, res, _next) => {
  const rand = "0";

  if (rand === "0") throw new AppError("zero", 201);

  res.status(200).json({
    status: "success"
  });
});
