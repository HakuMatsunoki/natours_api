import { Request } from "express";
import { UploadedFile } from "express-fileupload";

import { UserObject } from "../models";

export interface RequestExt extends Request {
  user?: UserObject;
  photo?: UploadedFile | UploadedFile[];
}
