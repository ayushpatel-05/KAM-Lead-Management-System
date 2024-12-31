import { Router } from "express";
import { InteractionController } from "./interaction.controller";
import { asyncErrorHandler } from "../../middleware/asyncErrorHandler";
import isAuthenticatedUser from "../../middleware/authMiddleware";

const router = Router();
const interactionController = new InteractionController();

router.get("/interactions", isAuthenticatedUser, (req, res, next) => asyncErrorHandler(interactionController.getAllInteractions(req, res, next)));
router.get("/interactions/:id", isAuthenticatedUser, (req, res, next) => asyncErrorHandler(interactionController.getInteractionsById(req, res, next)));
router.get("/contacts/:id/interactions", isAuthenticatedUser, (req, res, next) => asyncErrorHandler(interactionController.getInteractionsByContactId(req, res, next)));
router.post("/interactions",isAuthenticatedUser, (req, res, next) => asyncErrorHandler(interactionController.createInteractions(req, res, next)));
router.patch("/interactions/:id",isAuthenticatedUser, (req, res, next) => asyncErrorHandler(interactionController.updateInteractions(req, res, next)));//Name, POC, Restaurant, Notes, Source
router.delete("/interactions/:id",isAuthenticatedUser, (req, res, next) => asyncErrorHandler(interactionController.deleteInteractions(req, res, next)));

export default router;