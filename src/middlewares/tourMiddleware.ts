import { RequestHandler } from "express";
import { UploadedFile } from "express-fileupload";

import { RequestExt } from "../common";
import { appConfig } from "../configs";
import { Messages, StatusCodes, TourFields } from "../constants";
import { UserDoc } from "../models";
import { s3BucketUpload, imageSharper } from "../services";
import {
  AppError,
  catchAsync,
  fileNameBuilder,
  FileName,
  filterRequestObject
} from "../utils";
import {
  // paramsValidators,
  tourRegularValidators
  // userStrictValidators
} from "../validators";

// "name": "The TEST Tour",
//         "duration": 1,
//         "maxGroupSize": 1,
//         "difficulty": "difficult",
//         "price": 1200,
//         "summary": "Test tour",
//         "imageCover": "tour-3-cover.jpg"

export const filterCreateTourObject: RequestHandler = (req, _res, _next) => {
  const allowedFields: string[] = [
    TourFields.NAME,
    TourFields.DURATION,
    TourFields.MAX_GROUP,
    TourFields.DIFFICULTY,
    TourFields.PRICE,
    TourFields.SUMM,
    TourFields.DESC,
    TourFields.START_DATES,
    TourFields.START_LOCATION,
    TourFields.LOCATIONS,
    TourFields.SECRET,
    TourFields.GUIDES 
  ];
  req.body = filterRequestObject(
    req.body,
    allowedFields,
    tourRegularValidators
  );

  console.log(req.body);

  // next();
};

// export const filterUpdateTourObject: RequestHandler = (req, _res, next) => {
//   const allowedFields: string[] = [UserFields.NAME, UserFields.EMAIL];
//   req.body = filterRequestObject(
//     req.body,
//     allowedFields,
//     userRegularValidators
//   );

//   next();
// };

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
    const fileNameObj: FileName = fileNameBuilder("jpg", "users", id);

    const sharpedPhoto: Buffer = await imageSharper(photo);
    await s3BucketUpload(fileNameObj.path, photo.mimetype, sharpedPhoto);

    req.body.photo = fileNameObj.file;

    next();
  }
);
