import { Router } from "express";
import { LeadController } from "./lead.controller";
import { asyncErrorHandler } from "../../middleware/asyncErrorHandler";
import isAuthenticatedUser from "../../middleware/authMiddleware";

const router = Router();
const leadController = new LeadController();

router.get("/leads", isAuthenticatedUser, (req, res, next) => asyncErrorHandler(leadController.getAllLeads(req, res, next)));
router.get("/leads/:id", isAuthenticatedUser, (req, res, next) => asyncErrorHandler(leadController.getLeadById(req, res, next)));
router.get("/leads/:id/interactions", isAuthenticatedUser, (req, res, next) => asyncErrorHandler(leadController.getLeadInteractions(req, res, next)));//Should it be here or in interactions module
router.get("/leads/:id/call-schedules", isAuthenticatedUser, (req, res, next) => asyncErrorHandler(leadController.getLeadCallSchedules(req, res, next)));//Should it be here or in callSchedule module
router.post("/leads",isAuthenticatedUser, (req, res, next) => asyncErrorHandler(leadController.createLead(req, res, next)));
router.post("/leads/:id/assign-manager", isAuthenticatedUser, (req, res, next) => asyncErrorHandler(leadController.reassignManager(req, res, next)))
router.post("/leads/:id/contacts",isAuthenticatedUser, (req, res, next) => asyncErrorHandler(leadController.createContact(req, res, next)));//Should it be here or in restaurant module
router.patch("/leads/:id",isAuthenticatedUser, (req, res, next) => asyncErrorHandler(leadController.updateLead(req, res, next)));//Name, Notes, Source
router.patch("/leads/:id/status", isAuthenticatedUser, (req, res, next) => asyncErrorHandler(leadController.updateLeadStatus(req, res, next)));//Status
router.delete("/leads/:id",isAuthenticatedUser, (req, res, next) => asyncErrorHandler(leadController.deleteLead(req, res, next)));
//Different route for poc
export default router;