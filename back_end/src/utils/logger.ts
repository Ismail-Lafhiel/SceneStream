import { Request, Response, NextFunction } from "express";

const logger = (req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  const { method, url } = req;
  console.log(`[${timestamp}] ${method} ${url}`);
  next();
};

export default logger;
