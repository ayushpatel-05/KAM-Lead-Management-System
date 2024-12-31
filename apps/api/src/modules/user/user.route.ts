import { Router } from "express";
import { AuthController } from "./user.controller";
import { asyncErrorHandler } from "../../middleware/asyncErrorHandler";
import isAuthenticatedUser from "../../middleware/authMiddleware";

const router = Router();
const authController = new AuthController();

router.post("/auth/login", (req, res, next) => asyncErrorHandler(authController.login(req, res, next)));
router.post("/auth/register", (req, res, next) => asyncErrorHandler(authController.register(req, res, next)));
router.get("/me", isAuthenticatedUser, (req, res, next) => asyncErrorHandler(authController.getUser(req,res,next)))

export default router;