import type { Request } from "express";
import type { UploadedFile } from "express-fileupload";
import type { StringSchema } from "joi";

import { UserObject } from "../models";

export interface RequestExt extends Request {
  user?: UserObject;
  photo?: UploadedFile | UploadedFile[];
}

export interface JoiValidatorsObj {
  [prop: string]: StringSchema;
}

export interface UnknownObj {
  [prop: string]: any;
}
