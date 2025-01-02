import { InteractionRepository } from "./interaction.repository";
import { CallIntent, CallScheduleResponseSchema, CallScheduleStatus, GetAllInteractionPayload, InteractionResponseSchema } from "@repo/schemas";
import { CallSchedule, Contact, Interaction, Lead, User} from "@repo/db";
import { BadRequestError, InternalServerError } from "../../utils/api-errors";

export class InteractionService {
  private interactionRepository: InteractionRepository;

  constructor() {
    this.interactionRepository = new InteractionRepository();
  }

  async getInteractionById(id: string) {
    const interaction = await this.interactionRepository.findById(id);
    if (!interaction) {
      throw new BadRequestError("Interaction does not exist");
    }

    return { interaction };
  }


  async getAllInteractions(filterData: GetAllInteractionPayload, page?: number, size?: number) {
    const result = await this.interactionRepository.findAll(filterData, page, size);

    return result;
  }

  async create(interactionData: Partial<Interaction>, lead: Lead, contact: Contact, user: User): Promise<Interaction> {
    try {

      const interaction = await this.interactionRepository.create(interactionData, lead, contact, user);
      return await this.interactionRepository.save(interaction);
    } catch (error) {
      console.error('Error creating interaction:', error);
      throw error;
    }
  }

   /**
   * Update a interaction entity.
   * @param id - The interaction ID to update.
   * @param interactionData - Partial data for the interaction
   * @returns The updated interaction entity.
   */
   async updateInteraction(id: string, interactionData: Partial<Interaction>): Promise<Interaction> {
    const interaction = await this.interactionRepository.update(id, interactionData);
    return interaction;
  }

  /**
   * Soft delete a interaction by ID.
   * @param id - The interaction ID to delete.
   */
  async deleteInteraction(id: string): Promise<void> {
    const result = await this.interactionRepository.softDeleteById(id);
    if(!result) {
        throw new InternalServerError("Some error occured")
    }
    return;
  }

  sanitizeInteraction(interactionOrInteractions: Interaction | Interaction[]) {
    console.log(interactionOrInteractions);
    if (Array.isArray(interactionOrInteractions)) {
      return interactionOrInteractions.map((interaction) => {
        return InteractionResponseSchema.parse(interaction);
      });
    } else {
      return InteractionResponseSchema.parse(interactionOrInteractions);
    }
  }

}
