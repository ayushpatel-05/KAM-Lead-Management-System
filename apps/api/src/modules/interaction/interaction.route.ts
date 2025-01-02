import { Router } from "express";
import { InteractionController } from "./interaction.controller";
import { asyncErrorHandler } from "../../middleware/asyncErrorHandler";
import isAuthenticatedUser from "../../middleware/authMiddleware";
import { checkLeadOwnership } from "../../middleware/checkLeadOwnership";
import { checkContactAssociation } from "../../middleware/checkContactAssociation";
import { checkInteractionOwnership } from "../../middleware/checkInteractionOwnership ";

const router = Router();
const interactionController = new InteractionController();
/**Get all interaction of a user */
router.get("/interactions", isAuthenticatedUser, (req, res, next) => asyncErrorHandler(interactionController.getAllInteractions(req, res, next)));
/**Get interaction detail by id */
router.get("/interactions/:id", isAuthenticatedUser, (req, res, next) => asyncErrorHandler(interactionController.getInteractionById(req, res, next)));
// /**Get interaction list by contact id */
// router.get("/contacts/:id/interactions", isAuthenticatedUser, (req, res, next) => asyncErrorHandler(interactionController.getInteractionsByContactId(req, res, next)));
/**Create an interaction for a perticular lead and POC */
router.post("/interactions", checkLeadOwnership, checkContactAssociation, isAuthenticatedUser, (req, res, next) => asyncErrorHandler(interactionController.createInteraction(req, res, next)));
/**Update an interaction */
router.patch("/interactions/:id",isAuthenticatedUser, checkInteractionOwnership, (req, res, next) => asyncErrorHandler(interactionController.updateInteraction(req, res, next)));//Name, POC, Restaurant, Notes, Source
/**Delete an interaction */
router.delete("/interactions/:id",isAuthenticatedUser, checkInteractionOwnership, (req, res, next) => asyncErrorHandler(interactionController.deleteInteraction(req, res, next)));

export default router;
//Order creation will be based on interaction, so there should be a seperate entity for orders