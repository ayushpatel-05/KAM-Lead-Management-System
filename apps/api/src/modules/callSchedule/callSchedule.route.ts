import { Router } from "express";
import { CallScheduleController } from "./callSchedule.controller";
import { asyncErrorHandler } from "../../middleware/asyncErrorHandler";
import isAuthenticatedUser from "../../middleware/authMiddleware";

const router = Router();
const callScheduleController = new CallScheduleController();

/**Get all the call schedules of a user */
router.get("/call-schedules", isAuthenticatedUser, (req, res, next) => asyncErrorHandler(callScheduleController.getAllCallSchedules(req, res, next)));
/**Get a call schedule detail by id */
router.get("/call-schedules/:id", isAuthenticatedUser, (req, res, next) => asyncErrorHandler(callScheduleController.getCallSchedulesById(req, res, next)));
/**Get call schedules with perticular contact */
router.get("/contacts/:id/call-schedules", isAuthenticatedUser, (req, res, next) => asyncErrorHandler(callScheduleController.getCallSchedulesByContactId(req, res, next)));
/**Create a call schedule */
router.post("/call-schedules",isAuthenticatedUser, (req, res, next) => asyncErrorHandler(callScheduleController.createCallSchedules(req, res, next)));
/** Update a call schedule*/
router.patch("/call-schedules/:id",isAuthenticatedUser, (req, res, next) => asyncErrorHandler(callScheduleController.updateCallSchedules(req, res, next)));//Name, POC, Restaurant, Notes, Source
/**Delete a call schedule */
router.delete("/call-schedules/:id",isAuthenticatedUser, (req, res, next) => asyncErrorHandler(callScheduleController.deleteCallSchedules(req, res, next)));

//Update call schedule status
//Upcoming call schedule(Can be possibly incorporated in get all call schedules)
//Missed call schedule(Maybe in performance)
//Reminter/notification 
export default router;