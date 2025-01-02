import { NextFunction, Response } from "express";
import { ExtendedRequest } from "../types/ExtendedRequest";
import { NotFoundError, UnauthorizedError } from "../utils/api-errors";
import { AppDataSource, Contact } from "@repo/db";

export const checkContactAssociation = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    try {
      const { leadId, contactId } = req.body;
  
      if (!leadId || !contactId) {
        throw new NotFoundError("Both Lead ID and Contact ID are required");
      }
  
      const contactRepository = AppDataSource.getRepository(Contact);
      const contact = await contactRepository.findOne({
        where: { id: contactId, lead: { id: leadId } },
      });
  
      if (!contact) {
        throw new UnauthorizedError("The contact is not associated with the specified lead.");
      }
      req.contact = contact;
      next();
    } catch (error) {
      next(error);
    }
  };