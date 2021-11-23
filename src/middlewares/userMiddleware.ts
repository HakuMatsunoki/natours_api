import { RequestHandler } from "express";
import { UploadedFile } from "express-fileupload";

import { RequestExt } from "../common";
import { appConfig } from "../configs";
import { Messages, StatusCodes, UserFields } from "../constants";
import { UserDoc } from "../models";
import { s3BucketUpload, userAvatarSharp } from "../services";
import { AppError, catchAsync, fileNameBuilder, filterBodyObj } from "../utils";

export const filterUpdateUserObject: RequestHandler = (req, _res, next) => {
  if (req.body.passwd) {
    return next(
      new AppError(Messages.FORBIDDEN_PASSWD_FIELD, StatusCodes.BAD_REQUEST)
    );
  }

  req.body = filterBodyObj(req.body, UserFields.NAME, UserFields.EMAIL);

  next();
};

export const checkUserPhoto: RequestHandler = (req: RequestExt, _res, next) => {
  const photo: UploadedFile | UploadedFile[] | undefined = req.files?.photo;

  if (!photo) return next();

  if (Array.isArray(photo))
    return next(
      new AppError(Messages.FILE_NOT_SINGLE, StatusCodes.BAD_REQUEST)
    );

  if (photo.size > appConfig.USER_AVATAR_MAX_SIZE)
    return next(new AppError(Messages.FILE_LARGE, StatusCodes.BAD_REQUEST));

  const fileType: string = photo.mimetype;

  if (!fileType.includes("image"))
    return next(new AppError(Messages.FILE_INVALID, StatusCodes.BAD_REQUEST));

  req.photo = photo;

  next();
};

export const uploadPhoto: RequestHandler = catchAsync(
  async (req: RequestExt, _res, next) => {
    const photo = req.photo as UploadedFile;

    if (!photo) return next();

    const { id } = req.user as UserDoc;
    const fileName: string = fileNameBuilder(
      photo.mimetype.split("/")[1],
      "users",
      id
    );

    const sharpedPhoto: Buffer = await userAvatarSharp(photo);
    await s3BucketUpload(fileName, photo.mimetype, sharpedPhoto);

    req.body.photo = fileName;

    next();
  }
);
