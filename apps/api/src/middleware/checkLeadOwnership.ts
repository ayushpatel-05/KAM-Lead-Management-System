import { NextFunction, Response } from "express";
import { ExtendedRequest } from "../types/ExtendedRequest";
import { NotFoundError, UnauthorizedError } from "../utils/api-errors";
import { AppDataSource, Lead } from "@repo/db";

export const checkLeadOwnership = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    try {
      const { leadId } = req.body;
      const userId = req.user?.id; // Assuming `req.user` contains authenticated user information
  
      if (!leadId) {
        throw new NotFoundError("Lead ID is required");
      }
  
      const leadRepository = AppDataSource.getRepository(Lead);
      const lead = await leadRepository.findOne({ where: { id: leadId, keyAccountManager: { id: userId } } });
  
      if (!lead) {
        throw new UnauthorizedError("You do not own this lead or it does not exist.");
      }
      req.lead = lead;
      next();
    } catch (error) {
      next(error);
    }
};