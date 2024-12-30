import { Router } from "express";
import { AuthController } from "./user.controller";
import { asyncErrorHandler } from "../../middleware/asyncErrorHandler";

const router = Router();
const authController = new AuthController();

router.post("/login", (req, res, next) => asyncErrorHandler(authController.login(req, res, next)));
router.post("/register", (req, res, next) => asyncErrorHandler(authController.register(req, res, next)));

export default router;