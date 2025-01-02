import { AppDataSource, Interaction, User, Lead, Contact } from "@repo/db";
import { Repository } from "typeorm";
import { GetAllInteractionPayload } from "@repo/schemas";

export class InteractionRepository {
  private repository: Repository<Interaction>;

  constructor() {
    this.repository = AppDataSource.getRepository(Interaction);
  }

  /**
   * Find an interaction by its unique ID
   * @param id - The UUID of the interaction.
   * @returns The interaction entity or null if not found.
   */
  async findById(id: string): Promise<Interaction | null> {
    try {
      return await this.repository.findOne({
        where: { id },
        relations: ["lead", "contact", "user"],
      });
    } catch (error) {
      console.error("Error finding interaction by ID:", error);
      throw error;
    }
  }

  /**
   * Retrieve a paginated list of interactions with optional filters.
   * @param filters - Partial filters based on Interaction fields.
   * @param page - The page number for pagination.
   * @param size - The number of records per page.
   * @returns A tuple containing an array of interactions and the total count.
   */
  async findAll(
    filters: GetAllInteractionPayload,
    page: number = 1,
    size: number = 10
  ): Promise<[Interaction[], number]> {
    try {
      const query = this.repository.createQueryBuilder("interaction")
        .leftJoinAndSelect("interaction.lead", "lead")
        .leftJoinAndSelect("interaction.contact", "contact")
        .leftJoinAndSelect("interaction.user", "user")
        .where("interaction.deletedDate IS NULL")
        .skip((page - 1) * size)
        .take(size);

      if (filters.interactionType) {
        query.andWhere("interaction.interactionType = :interactionType", {
          interactionType: filters.interactionType,
        });
      }

      if (filters.interactionSubtype) {
        query.andWhere("interaction.interactionSubtype = :interactionSubtype", {
          interactionSubtype: filters.interactionSubtype,
        });
      }

      if (filters.interactionMethod) {
        query.andWhere("interaction.interactionMethod = :interactionMethod", {
          interactionMethod: filters.interactionMethod,
        });
      }

      if (filters.callDuration && filters.callDuration.time) {
        if (filters.callDuration.greaterThan) {
          query.andWhere("interaction.callDuration > :callDuration", { callDuration: filters.callDuration.time });
        } else {
          query.andWhere("interaction.callDuration <= :callDuration", { callDuration: filters.callDuration.time });
        }
      }

      
      if (filters.details) {
          query.andWhere("interaction.details LIKE :details", {
              details: `%${filters.details}%`,
            });
        }
      if (filters.startDate && filters.endDate) {
          query.andWhere("interaction.interactionDate BETWEEN :startDate AND :endDate", {
            startDate: filters.startDate,
            endDate: filters.endDate,
          });
      }
        
      if (filters.outcome) {
          query.andWhere("interaction.outcome = :outcome", {
          outcome: filters.outcome,
          });
      }

      if (filters.leadId) {
        query.andWhere("interaction.lead.id = :leadId", { leadId: filters.leadId });
      }

      if (filters.contactId) {
        query.andWhere("interaction.contact.id = :contactId", {
          contactId: filters.contactId,
        });
      }

      if (filters.createdBy) {
        query.andWhere("interaction.user.id = :createdBy", { createdBy: filters.createdBy });
      }

      return await query.getManyAndCount();
    } catch (error) {
      console.error("Error retrieving interactions:", error);
      throw error;
    }
  }

  /**
 * Create a new interaction entity and optionally associate a lead, a contact, and a user.
 * @param interactionData - Partial data for the interaction.
 * @param lead - Lead entity or lead ID to associate with the interaction.
 * @param contact - Contact entity or contact ID to associate with the interaction.
 * @param user - User entity or user ID who initiated the interaction.
 * @returns The created but unsaved interaction entity.
 */
async create(
    interactionData: Partial<Interaction>,
    lead?: Lead | string,
    contact?: Contact | string,
    user?: User | string
  ): Promise<Interaction> {
    const interaction = this.repository.create(interactionData);
  
    if (lead) {
      if (typeof lead === "string") {
        const leadRepository = AppDataSource.getRepository(Lead);
        const leadEntity = await leadRepository.findOne({ where: { id: lead } });
        if (!leadEntity) {
          throw new Error("Lead not found");
        }
        interaction.lead = leadEntity;
      } else {
        interaction.lead = lead;
      }
    }
  
    if (contact) {
      if (typeof contact === "string") {
        const contactRepository = AppDataSource.getRepository(Contact);
        const contactEntity = await contactRepository.findOne({ where: { id: contact } });
        if (!contactEntity) {
          throw new Error("Contact not found");
        }
        interaction.contact = contactEntity;
      } else {
        interaction.contact = contact;
      }
    }
  
    if (user) {
      if (typeof user === "string") {
        const userRepository = AppDataSource.getRepository(User);
        const userEntity = await userRepository.findOne({ where: { id: user } });
        if (!userEntity) {
          throw new Error("User not found");
        }
        interaction.user = userEntity;
      } else {
        interaction.user = user;
      }
    }
  
    return interaction;
  }
  

  /**
   * Save an interaction entity to the database.
   * @param interaction - The interaction entity to save.
   * @returns The saved interaction entity.
   */
  async save(interaction: Interaction): Promise<Interaction> {
    try {
      return await this.repository.save(interaction);
    } catch (error) {
      console.error("Error saving interaction:", error);
      throw error;
    }
  }

  /**
 * Update an existing interaction's details.
 * @param id - The UUID of the interaction to update.
 * @param updateData - Partial data to update the interaction.
 * @returns The updated interaction entity or undefined if not found.
 */
async update(
    id: string,
    updateData: Partial<Interaction>
  ): Promise<Interaction> {
    try {
      const interaction = await this.repository.findOne({ where: { id } });
      if (!interaction) {
        throw new Error("Interaction not found");
      }
      console.log("Before update: ", interaction);
  
      // Update interaction fields
      if (updateData.interactionType !== undefined) {
        interaction.interactionType = updateData.interactionType;
      }
      if (updateData.interactionSubtype !== undefined) {
        interaction.interactionSubtype = updateData.interactionSubtype;
      }
      if (updateData.interactionMethod !== undefined) {
        interaction.interactionMethod = updateData.interactionMethod;
      }
      if (updateData.callDuration !== undefined) {
        interaction.callDuration = updateData.callDuration;
      }
    //   if (updateData.orderAmount !== undefined) {
    //     interaction.orderAmount = updateData.orderAmount;
    //   }
      if (updateData.details !== undefined) {
        interaction.details = updateData.details;
      }
      if (updateData.interactionDate !== undefined) {
        interaction.interactionDate = updateData.interactionDate;
      }
      if (updateData.outcome !== undefined) {
        interaction.outcome = updateData.outcome;
      }
  
      console.log("After update: ", interaction);
  
      return await this.repository.save(interaction);
    } catch (error) {
      console.error("Error updating interaction:", error);
      throw error;
    }
  }
  

  /**
   * Soft delete an interaction by its ID.
   * @param id - The UUID of the interaction to delete.
   * @returns A boolean indicating success.
   */
  async softDeleteById(id: string): Promise<boolean> {
    try {
      const interaction = await this.repository.findOne({ where: { id } });
      if (interaction) {
        await this.repository.softRemove(interaction);
        return true;
      } else {
        throw new Error("Interaction not found");
      }
    } catch (error) {
      console.error("Error soft deleting interaction:", error);
      throw error;
    }
  }

  /**
   * Permanently delete an interaction by its ID.
   * @param id - The UUID of the interaction to delete.
   * @returns A boolean indicating success.
   */
  async hardDeleteById(id: string): Promise<boolean> {
    try {
      const result = await this.repository.delete(id);
      return result.affected !== 0;
    } catch (error) {
      console.error("Error hard deleting interaction:", error);
      throw error;
    }
  }
}
