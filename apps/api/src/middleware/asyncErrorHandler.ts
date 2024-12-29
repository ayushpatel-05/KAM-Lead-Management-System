import { Request, Response, NextFunction } from "express";
const asyncErrorHandler = (fn:any) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncErrorHandler;