import { Router } from "express";
import { LeadController } from "./lead.controller";
import { asyncErrorHandler } from "../../middleware/asyncErrorHandler";
import isAuthenticatedUser from "../../middleware/authMiddleware";

const router = Router();
const leadController = new LeadController();

router.get("/leads", isAuthenticatedUser, (req, res, next) => asyncErrorHandler(leadController.getAllLeads(req, res, next)));
router.get("/leads/:id", isAuthenticatedUser, (req, res, next) => asyncErrorHandler(leadController.getLeadById(req, res, next)));
router.get("/leads/:id/interactions", isAuthenticatedUser, (req, res, next) => asyncErrorHandler(leadController.getLeadInteractions(req, res, next)));//Should it be here or in interactions module
router.get("/leads/:id/call-schedules", isAuthenticatedUser, (req, res, next) => asyncErrorHandler(leadController.getLeadInteractions(req, res, next)));//Should it be here or in callSchedule module
router.post("/leads",isAuthenticatedUser, (req, res, next) => asyncErrorHandler(leadController.createLead(req, res, next)));
router.post("/lead/:id/status", isAuthenticatedUser, (req, res, next) => asyncErrorHandler(leadController.updateLeadStatus(req, res, next)));//Status
router.post("/lead/:id/assign-manager", (req, res, next) => asyncErrorHandler(leadController.reassignManager(req, res, next)))
router.patch("/lead/:id",isAuthenticatedUser, (req, res, next) => asyncErrorHandler(leadController.updateLead(req, res, next)));//Name, POC, Restaurant, Notes, Source
router.delete("/lead/:id",isAuthenticatedUser, (req, res, next) => asyncErrorHandler(leadController.deleteLead(req, res, next)));

export default router;