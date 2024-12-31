import { Router } from "express";
import { InteractionController } from "./interaction.controller";
import { asyncErrorHandler } from "../../middleware/asyncErrorHandler";
import isAuthenticatedUser from "../../middleware/authMiddleware";

const router = Router();
const interactionController = new InteractionController();
/**Get all interaction of a user */
router.get("/interactions", isAuthenticatedUser, (req, res, next) => asyncErrorHandler(interactionController.getAllInteractions(req, res, next)));
/**Get interaction detail by id */
router.get("/interactions/:id", isAuthenticatedUser, (req, res, next) => asyncErrorHandler(interactionController.getInteractionsById(req, res, next)));
/**Get interaction list by contact id */
router.get("/contacts/:id/interactions", isAuthenticatedUser, (req, res, next) => asyncErrorHandler(interactionController.getInteractionsByContactId(req, res, next)));
/**Create an interaction for a perticular lead and POC */
router.post("/interactions",isAuthenticatedUser, (req, res, next) => asyncErrorHandler(interactionController.createInteractions(req, res, next)));
/**Update an interaction */
router.patch("/interactions/:id",isAuthenticatedUser, (req, res, next) => asyncErrorHandler(interactionController.updateInteractions(req, res, next)));//Name, POC, Restaurant, Notes, Source
/**Delete an interaction */
router.delete("/interactions/:id",isAuthenticatedUser, (req, res, next) => asyncErrorHandler(interactionController.deleteInteractions(req, res, next)));

export default router;
//Order creation will be based on interaction, so there should be a seperate entity for orders