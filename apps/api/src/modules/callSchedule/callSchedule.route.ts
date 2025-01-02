import { Router } from "express";
import { CallScheduleController } from "./callSchedule.controller";
import { asyncErrorHandler } from "../../middleware/asyncErrorHandler";
import isAuthenticatedUser from "../../middleware/authMiddleware";
import { checkLeadOwnership } from "../../middleware/checkLeadOwnership";
import { checkContactAssociation } from "../../middleware/checkContactAssociation";
import { checkCallScheduleLeadAssociation } from "../../middleware/checkCallScheduleLeadAssociation";
import { checkCallScheduleOwnership } from "../../middleware/checkCallScheduleOwnership ";

const router = Router();
const callScheduleController = new CallScheduleController();

/**Get all the call schedules of a user */
router.get("/call-schedules", isAuthenticatedUser, (req, res, next) => asyncErrorHandler(callScheduleController.getAllCallSchedules(req, res, next)));
/**Get a call schedule detail by id */
router.get("/call-schedules/:id", isAuthenticatedUser, (req, res, next) => asyncErrorHandler(callScheduleController.getCallScheduleById(req, res, next)));
/**Create a call schedule */
router.post("/call-schedules",isAuthenticatedUser, checkLeadOwnership, checkContactAssociation, (req, res, next) => asyncErrorHandler(callScheduleController.createCallSchedule(req, res, next)));//TODO: Need changes
/** Update a call schedule*/
router.patch("/call-schedules/:id",isAuthenticatedUser, checkCallScheduleOwnership, (req, res, next) => asyncErrorHandler(callScheduleController.updateCallSchedule(req, res, next)));//Name, POC, Restaurant, Notes, Source
/**Delete a call schedule */
router.delete("/call-schedules/:id",isAuthenticatedUser, checkCallScheduleOwnership, (req, res, next) => asyncErrorHandler(callScheduleController.deleteCallSchedule(req, res, next)));

//Update call schedule status
//Upcoming call schedule(Can be possibly incorporated in get all call schedules)
//Missed call schedule(Maybe in performance)
//Reminter/notification 
export default router;