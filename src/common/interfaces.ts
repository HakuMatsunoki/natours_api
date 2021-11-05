import { Request, Response, NextFunction } from "express";

export interface RequestHandler {
  (req: Request, res: Response, next: NextFunction): void;
}

export interface ErrorHandler {
  (err: any, req: Request, res: Response, next?: NextFunction): void;
}
