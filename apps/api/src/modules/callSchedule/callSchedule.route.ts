import { Router } from "express";
import { CallScheduleController } from "./callSchedule.controller";
import { asyncErrorHandler } from "../../middleware/asyncErrorHandler";
import isAuthenticatedUser from "../../middleware/authMiddleware";

const router = Router();
const callScheduleController = new CallScheduleController();

router.get("/call-schedules", isAuthenticatedUser, (req, res, next) => asyncErrorHandler(callScheduleController.getAllCallSchedules(req, res, next)));
router.get("/call-schedules/:id", isAuthenticatedUser, (req, res, next) => asyncErrorHandler(callScheduleController.getCallSchedulesById(req, res, next)));
router.get("/contacts/:id/call-schedules", isAuthenticatedUser, (req, res, next) => asyncErrorHandler(callScheduleController.getCallSchedulesByContactId(req, res, next)));
router.post("/call-schedules",isAuthenticatedUser, (req, res, next) => asyncErrorHandler(callScheduleController.createCallSchedules(req, res, next)));
// router.post("/lead/:id/status", isAuthenticatedUser, (req, res, next) => asyncErrorHandler(callScheduleController.updateLeadStatus(req, res, next)));//Status
// router.post("/lead/:id/assign-manager", (req, res, next) => asyncErrorHandler(callScheduleController.reassignManager(req, res, next)))
router.patch("/call-schedules/:id",isAuthenticatedUser, (req, res, next) => asyncErrorHandler(callScheduleController.updateCallSchedules(req, res, next)));//Name, POC, Restaurant, Notes, Source
router.delete("/call-schedules/:id",isAuthenticatedUser, (req, res, next) => asyncErrorHandler(callScheduleController.deleteCallSchedules(req, res, next)));
//Update call schedule status
//Upcoming call schedule
//Missed call schedule(Maybe in performance)
//Reminter/notification 
export default router;