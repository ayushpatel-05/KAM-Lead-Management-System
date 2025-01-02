import { AppDataSource, Contact } from "@repo/db";
import { Repository, Like } from "typeorm";
import { CallSchedule, Lead } from "@repo/db";
import { GetAllCallSchedulePayload } from "@repo/schemas";

export class CallScheduleRepository {
  private repository: Repository<CallSchedule>;

  constructor() {
    this.repository = AppDataSource.getRepository(CallSchedule);
  }

  /**
   * Find a call schedule by its unique ID
   * @param id - The UUID of the restaurant.
   * @returns The call schedule entity or null if not found.
   */
  async findById(id: string): Promise<CallSchedule | null> {
    try {
      return await this.repository.findOne({
        where: { id },
        relations: ["lead", "contact"],
      });
    } catch (error) {
      console.error("Error finding restaurant by ID:", error);
      throw error; // Re-throw to allow higher-level handling
    }
  }


 /**
   * Retrieve a paginated list of call schedules with optional filters.
   * @param filters - Partial filters based on CallSchedule fields.
   * @param page - The page number for pagination.
   * @param size - The number of records per page.
   * @returns A tuple containing an array of call schedules and the total count.
   */
 async findAll(
    filters: GetAllCallSchedulePayload,
    page: number = 1,
    size: number = 10
  ): Promise<[CallSchedule[], number]> {
    try {
      console.log("The filter is: ", filters);

      const query = this.repository.createQueryBuilder("callSchedule")
        .leftJoinAndSelect("callSchedule.lead", "lead")
        .leftJoinAndSelect("callSchedule.contact", "contact")
        .where("callSchedule.deletedDate IS NULL") // Exclude soft-deleted records
        .skip((page - 1) * size)
        .take(size);

      if (filters.id) {
        query.andWhere("callSchedule.id = :id", { id: filters.id });
      }

      if (filters.type) {
        query.andWhere("callSchedule.type = :type", { type: filters.type });
      }

      if (filters.datetime) {
        query.andWhere("callSchedule.datetime = :datetime", { datetime: filters.datetime });
      }

      if (filters.status) {
        query.andWhere("callSchedule.status = :status", { status: filters.status });
      }

      if (filters.intent) {
        query.andWhere("callSchedule.intent = :intent", { intent: filters.intent });
      }

      if (filters.notes) {
        query.andWhere("callSchedule.notes LIKE :notes", { notes: `%${filters.notes}%` });
      }

      if (filters.otherIntent) {
        query.andWhere("callSchedule.otherIntent LIKE :otherIntent", { otherIntent: `%${filters.otherIntent}%` });
      }

      if (filters.contactId) {
        query.andWhere("callSchedule.contact.id = :contactId", { contactId: filters.contactId });
      }

      if (filters.leadId) {
        query.andWhere("callSchedule.lead.id = :leadId", { leadId: filters.leadId });
      }

      return await query.getManyAndCount();
    } catch (error) {
      console.error("Error retrieving call schedules:", error);
      throw error;
    }
  }


 /**
   * Create a new call schedule entity and optionally associate a lead and a contact.
   * @param callScheduleData - Partial data for the call schedule.
   * @param lead - Lead entity or lead ID to associate with the call schedule.
   * @param contact - Contact entity or contact ID to associate with the call schedule.
   * @returns The created but unsaved call schedule entity.
   */
 async create(
    callScheduleData: Partial<CallSchedule>,
    lead?: Lead | string,
    contact?: Contact | string,
  ): Promise<CallSchedule> {
    const callSchedule = this.repository.create(callScheduleData);
    console.log("The data is: ", callScheduleData, lead, contact);

    if (lead) {
      if (typeof lead === "string") {
        const leadRepository = AppDataSource.getRepository(Lead);
        const leadEntity = await leadRepository.findOne({ where: { id: lead } });
        if (!leadEntity) {
          throw new Error("Lead not found");
        }
        callSchedule.lead = leadEntity;
      } else {
        callSchedule.lead = lead;
      }
    }

    if (contact) {
      if (typeof contact === "string") {
        const contactRepository = AppDataSource.getRepository(Contact);
        const contactEntity = await contactRepository.findOne({ where: { id: contact } });
        if (!contactEntity) {
          throw new Error("Contact not found");
        }
        callSchedule.contact = contactEntity;
      } else {
        callSchedule.contact = contact;
      }
    }

    return callSchedule;
  }

  /**
   * Save a call schedule entity to the database.
   * @param callSchedule - The call schedule entity to save.
   * @returns The saved call schedule entity.
   */
  async save(callSchedule: CallSchedule): Promise<CallSchedule> {
    try {
      return await this.repository.save(callSchedule);
    } catch (error) {
      console.error("Error saving call schedule:", error);
      throw error;
    }
  }



   /**
   * Update an existing call schedule's details.
   * @param id - The UUID of the call schedule to update.
   * @param updateData - Partial data to update the call schedule.
   * @returns The updated call schedule entity or undefined if not found.
   */
   async update(
    id: string,
    updateData: Partial<CallSchedule>
  ): Promise<CallSchedule> {
    try {
      const callSchedule = await this.repository.findOne({ where: { id } });
      if (!callSchedule) {
        throw new Error("Call schedule not found");
      }
      console.log("Before update: ", callSchedule);
      // Update call schedule fields
      // Object.assign(callSchedule, updateData);
      // Update call schedule fields
      if(updateData.type) 
        callSchedule.type = updateData.type;
      if(updateData.datetime)
        callSchedule.datetime = updateData.datetime;
      if(updateData.status)
        callSchedule.status = updateData.status;
      if(updateData.intent)
        callSchedule.intent = updateData.intent;
      if(updateData.otherIntent)
        callSchedule.otherIntent = updateData.otherIntent;
      // Object.keys(updateData).forEach((key) => {
      //   (callSchedule as any)[key] = (updateData as any)[key];
      // });
      console.log("After update: ", callSchedule);

      return await this.repository.save(callSchedule);
    } catch (error) {
      console.error("Error updating call schedule:", error);
      throw error;
    }
  }

  /**
   * Soft delete a call schedule by its ID.
   * @param id - The UUID of the call schedule to delete.
   * @returns A boolean indicating success.
   */
  async softDeleteById(id: string): Promise<boolean> {
    try {
      const callSchedule = await this.repository.findOne({ where: { id } });
      if (callSchedule) {
        await this.repository.softRemove(callSchedule);
        return true;
      } else {
        throw new Error("Call schedule not found");
      }
    } catch (error) {
      console.error("Error soft deleting call schedule:", error);
      throw error;
    }
  }

  /**
   * Permanently delete a call schedule by its ID.
   * @param id - The UUID of the call schedule to delete.
   * @returns A boolean indicating success.
   */
  async hardDeleteById(id: string): Promise<boolean> {
    try {
      const result = await this.repository.delete(id);
      return result.affected !== 0;
    } catch (error) {
      console.error("Error hard deleting call schedule:", error);
      throw error;
    }
  }



// /**
//  * Search for call schedules by intent or lead/contact name with pagination.
//  * @param queryStr - The search keyword.
//  * @param page - The page number for pagination.
//  * @param size - The number of records per page.
//  * @returns A tuple containing an array of call schedules and the total count.
//  */
// async search(
//     queryStr: string,
//     page: number = 1,
//     size: number = 10
//   ): Promise<[CallSchedule[], number]> {
//     try {
//       const queryBuilder = this.repository.createQueryBuilder("callSchedule")
//         .leftJoinAndSelect("callSchedule.lead", "lead")
//         .leftJoinAndSelect("callSchedule.contact", "contact")
//         .skip((page - 1) * size)
//         .take(size);
  
//       // Search by `intent` if the query matches a `CallIntent` enum value
//       const intentEnumValues = Object.values(CallIntent);
//       if (intentEnumValues.includes(queryStr as CallIntent)) {
//         queryBuilder.where("callSchedule.intent = :intent", { intent: queryStr });
//       } else {
//         // Search by notes, lead name, or contact name
//         queryBuilder.where("callSchedule.notes LIKE :query", { query: `%${queryStr}%` })
//           .orWhere("lead.name LIKE :query", { query: `%${queryStr}%` })
//           .orWhere("contact.name LIKE :query", { query: `%${queryStr}%` });
//       }
  
//       const [results, count] = await queryBuilder.getManyAndCount();
//       return [results, count];
//     } catch (error) {
//       console.error("Error searching call schedules:", error);
//       throw error;
//     }
//   }

}
