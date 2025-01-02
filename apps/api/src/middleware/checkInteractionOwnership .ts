import { Response, NextFunction } from "express";
import { AppDataSource, Interaction } from "@repo/db";
import { ExtendedRequest } from "../types/ExtendedRequest"; // Assuming a custom request type

export const checkInteractionOwnership = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id; // Assuming the authenticated user is attached to req.user
    const interactionId = req.params.id; // Interaction ID is passed as a route parameter

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    if (!interactionId) {
      return res.status(400).json({ message: "Interaction ID is required" });
    }

    const interactionRepository = AppDataSource.getRepository(Interaction);

    // Fetch the Interaction with its associated Lead and Key Account Manager
    const interaction = await interactionRepository.findOne({
      where: { id: interactionId },
      relations: ["lead", "lead.keyAccountManager"], // Include lead and keyAccountManager in query
    });

    if (!interaction) {
      return res.status(404).json({ message: "Interaction not found" });
    }

    // Check if the keyAccountManager of the associated Lead matches the authenticated user
    if (interaction.lead.keyAccountManager.id !== userId) {
      return res.status(403).json({
        message: "You do not have permission to access this interaction.",
      });
    }

    // Attach the Interaction entity to the request for downstream use
    req.interaction = interaction;

    next();
  } catch (error) {
    console.error("Error in checkInteractionOwnership middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
