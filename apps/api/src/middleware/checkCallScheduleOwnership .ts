import { Response, NextFunction } from "express";
import { AppDataSource } from "@repo/db";
import { CallSchedule } from "@repo/db";
import { ExtendedRequest } from "../types/ExtendedRequest";

export const checkCallScheduleOwnership = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id; // Assuming the authenticated user is attached to req.user
    const callScheduleId = req.params.id; // Call schedule ID is passed as a route parameter

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    if (!callScheduleId) {
      return res.status(400).json({ message: "Call Schedule ID is required" });
    }

    const callScheduleRepository = AppDataSource.getRepository(CallSchedule);

    // Fetch the CallSchedule with its associated Lead and Key Account Manager
    const callSchedule = await callScheduleRepository.findOne({
      where: { id: callScheduleId },
      relations: ["lead", "lead.keyAccountManager"], // Include lead and keyAccountManager in query
    });

    if (!callSchedule) {
      return res.status(404).json({ message: "Call schedule not found" });
    }

    // Check if the keyAccountManager of the associated Lead matches the authenticated user
    if (callSchedule.lead.keyAccountManager.id !== userId) {
      return res.status(403).json({
        message: "You do not have permission to access this call schedule.",
      });
    }

    // Attach the CallSchedule entity to the request for downstream use
    req.callSchedule = callSchedule;

    next();
  } catch (error) {
    console.error("Error in checkCallScheduleOwnership middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
