import { RequestHandler } from "express";

import { RequestExt } from "../common";
import { Messages, StatusCodes, UserFields } from "../constants";
import { AppError, filterBodyObj } from "../utils";

export const filterUpdateUserObject: RequestHandler = (
  req: RequestExt,
  _res,
  next
) => {
  if (req.body.passwd) {
    return next(
      new AppError(Messages.FORBIDDEN_PASSWD_FIELD, StatusCodes.BAD_REQUEST)
    );
  }

  req.body = filterBodyObj(req.body, UserFields.NAME, UserFields.EMAIL);

  // TODO:
  // if (req.file) req.body.photo = req.file.filename;

  next();
};
