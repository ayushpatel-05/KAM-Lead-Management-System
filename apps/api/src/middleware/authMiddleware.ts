import { AppDataSource, User } from "@repo/db";
import { AccessDeniedError } from "../utils/api-errors";
import { asyncErrorHandler } from "./asyncErrorHandler";
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ExtendedRequest } from "../types/ExtendedRequest";
// import { loginSchema } from "@repo/schemas"


const isAuthenticatedUser = asyncErrorHandler(async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    const { token } = req.cookies;
    if (!token) {
        return next(new AccessDeniedError("No token recieved"));
    }


    const decodedData= jwt.verify(token, process.env.JWT_SECRET_KEY!) as JwtPayload;
    const user = await AppDataSource.getRepository(User).findOneBy({ id: decodedData.id });
    if (!user) {
        return next(new AccessDeniedError("Invalid User"))
    }
    req.user = user;
    // debugger;
    next();
});

export default isAuthenticatedUser;