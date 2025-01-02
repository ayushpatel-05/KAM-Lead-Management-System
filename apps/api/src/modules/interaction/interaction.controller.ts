import { NextFunction, Request, Response } from "express";
import { InteractionService } from "./interaction.service";
import { ExtendedRequest } from "../../types/ExtendedRequest";
import { AccessDeniedError } from "../../utils/api-errors";
import { CreateInteractionSchema, InteractionGetAllQuerySchema, paginationQuerySchema, UpdateInteractionSchema } from "@repo/schemas";

export class InteractionController {
  private interactionService: InteractionService;

  constructor() {
    this.interactionService = new InteractionService();
  }

  async getInteractionById(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        const { interaction } = await this.interactionService.getInteractionById(id);

        // res.status(200).json({ message: "Interaction found", data: {interaction: this.interactionService.sanitizeInteraction(interaction)} });
        res.status(200).json({ message: "Interaction found", data: {interaction: this.interactionService.sanitizeInteraction(interaction)} });
    } catch (error: any) {
      next(error);
    }
  }


  async getAllInteractions(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
         const {page, size, ...filterData} = InteractionGetAllQuerySchema.parse(req.query);
        const result = await this.interactionService.getAllInteractions(filterData, page, size);
        res.status(201).json({ message: "Interaction found", data: {
            interaction: this.interactionService.sanitizeInteraction(result[0]),
            count: result[1]
        } });
    }
    catch(error: any) {
      next(error);
    }
  }

  async createInteraction(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
        const parsedData = CreateInteractionSchema.parse(req.body);

        const newInteraction = await this.interactionService.create(parsedData, req.lead!, req.contact!, req.user!);

        // res.status(201).json({message: "Interaction Created Succesfully",interaction: this.interactionService.sanitizeInteraction(newInteraction)});
        res.status(201).json({message: "Interaction Created Succesfully",interaction: this.interactionService.sanitizeInteraction(newInteraction)});
    }
    catch(error: any) {
      next(error);
    }
  }

async updateInteraction(req: ExtendedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const parsedData = UpdateInteractionSchema.parse(req.body);

      const updatedInteraction = await this.interactionService.updateInteraction(id, parsedData);

      res.status(200).json({message: "Interaction updated", data: {
        // interaction: this.interactionService.sanitizeInteraction(updatedInteraction)
        interaction: this.interactionService.sanitizeInteraction(updatedInteraction)
      }});
    } catch (error: any) {
      console.error('Error in updateInteraction:', error);
      next(error);
    }
  }

  async deleteInteraction(req: ExtendedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await this.interactionService.deleteInteraction(id);

      res.status(204).send();
    } catch (error: any) {
      console.error('Error in deleting interaction:', error);
      next(error);
    }
  }
}
