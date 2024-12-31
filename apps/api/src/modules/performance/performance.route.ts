import { Router } from "express";
import { PerformanceController } from "./performance.controller";
import { asyncErrorHandler } from "../../middleware/asyncErrorHandler";
import isAuthenticatedUser from "../../middleware/authMiddleware";

const router = Router();
const performanceController = new PerformanceController();

router.get("/performance/restaurants", isAuthenticatedUser, (req, res, next) => asyncErrorHandler(performanceController.getPerformanceByRestaurant(req, res, next)));//Qurey for top performer, underperformer etc
router.get("/performance/interactions", isAuthenticatedUser, (req, res, next) => asyncErrorHandler(performanceController.getPerformanceByInteractions(req, res, next)));
router.get("/performance/call-schedules", isAuthenticatedUser, (req, res, next) => asyncErrorHandler(performanceController.getPerformanceByCallSchedules(req, res, next)));
router.get("/performance/leads", isAuthenticatedUser, (req, res, next) => asyncErrorHandler(performanceController.getPerformanceByLeads(req, res, next)));
export default router;