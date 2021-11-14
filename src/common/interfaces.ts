import { Request } from "express";

import { UserObj } from "../models";

export interface RequestExt extends Request {
  user?: UserObj;
}
