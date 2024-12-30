import { AppDataSource, User } from "@repo/db";
import { AccessDeniedError } from "../utils/api-errors";
import { asyncErrorHandler } from "./asyncErrorHandler";
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';

interface ExtendedRequest extends Request {
    user?: User; // Optional user property
  }

exports.isAuthenticatedUser = asyncErrorHandler(async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    const { token } = req.cookies;
    if (!token) {
        return next(new AccessDeniedError("No token recieved"));
    }


    const secretKey:string = process.env.JWT_SECRET_KEY || "secret";
    const decodedData= jwt.verify(token, secretKey) as JwtPayload;
    const user = await AppDataSource.getRepository(User).findOneBy({ id: decodedData.id });
    if (!user) {
        return next(new AccessDeniedError("Invalid User"))
    }
    req.user = user;
    next();
});