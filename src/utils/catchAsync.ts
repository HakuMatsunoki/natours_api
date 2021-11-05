import type { RequestHandler } from "express";

export function catchAsync(fn: RequestHandler): RequestHandler {
  return (req, res, next) => {
    try {
      fn(req, res, next);
    } catch (err) {
      next(err);
    }
  };
}
