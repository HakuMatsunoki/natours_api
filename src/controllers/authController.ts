import { Request, Response } from "express";

export const signin = (_req: Request, res: Response): void => {
  res.status(200).json({
    status: "success"
  });
};
