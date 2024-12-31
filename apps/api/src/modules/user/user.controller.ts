import { NextFunction, Request, Response } from "express";
import { AuthService } from "./user.service";
import { loginSchema, backendRegisterSchema, User, UserSchema } from "@repo/schemas";
import { ExtendedRequest } from "../../middleware/authMiddleware";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate input
      const validatedData = loginSchema.parse(req.body);

      // Call service to handle login logic
      const result = await this.authService.login(validatedData);
      await this.authService.setTokenCookie(res, result.user)
      const sanitizedUser = UserSchema.parse(result.user);
      res.status(200).json({ message: "Login successful", data: {user: sanitizedUser} });
    } catch (error: any) {
      next(error);
    }
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate input using the register schema
      const validatedData = backendRegisterSchema.parse(req.body);
      
      // Call service to handle registration logic
      const result = await this.authService.register(validatedData);

      // Optionally, set a token cookie after registration
      await this.authService.setTokenCookie(res, result.user);

      res.status(201).json({ message: "Registration successful", data: result });
    } catch (error: any) {
      next(error);
    }
  }

  async getUser(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      if(req.user)
      {
        const user = await this.authService.getUser(req.user);

        res.status(200).json({message: "Success", data: user});
      }
      else {
        next(new Error("An error occured"));
      }
    }
    catch(error: any) {
      next(error);
    }
  }
}
