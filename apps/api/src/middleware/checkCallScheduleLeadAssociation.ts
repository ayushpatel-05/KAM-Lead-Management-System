import { Response, NextFunction } from "express";
import { AppDataSource, CallSchedule, Lead } from "@repo/db";
import { ExtendedRequest } from "../types/ExtendedRequest";

export const checkCallScheduleLeadAssociation = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const callScheduleId = req.params.id;
    const lead = req.lead;

    if (!lead) {
      return res.status(400).json({ message: "Lead is not attached to the request" });
    }
    //TODO: Add a schema check to verify the id validity
    if (!callScheduleId) {
      return res.status(400).json({ message: "Call Schedule ID is required" });
    }

    const callScheduleRepository = AppDataSource.getRepository(CallSchedule);

    // Check if the CallSchedule exists and is associated with the given Lead
    const callSchedule = await callScheduleRepository.findOne({
      where: { id: callScheduleId },
      relations: ["lead"],
    });

    if (!callSchedule) {
      return res.status(404).json({ message: "Call schedule not found" });
    }

    if (callSchedule.lead.id !== lead.id) {
      return res.status(403).json({
        message: "The Call Schedule is not associated with the specified Lead",
      });
    }

    // Attach the CallSchedule entity to the request for downstream use
    req.callSchedule = callSchedule;

    next();
  } catch (error) {
    console.error("Error in checkCallScheduleLeadAssociation middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};