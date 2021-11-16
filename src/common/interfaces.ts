import { Request } from "express";

import { UserObject } from "../models";

export interface RequestExt extends Request {
  user?: UserObject;
}
