import { AppDataSource, Restaurant } from "@repo/db";
import { Repository } from "typeorm";
import { Lead, User } from "@repo/db";
import { NotFoundError } from "../../utils/api-errors";

export class LeadRepository {
  private repository: Repository<Lead>;//Can use leadRepository instead of repository if multiple repositories are use

  constructor() {
    this.repository = AppDataSource.getRepository(Lead);
  }

  async findById(id: string) {
    return await this.repository.findOne({
      where: { id },
      relations: ["keyAccountManager", "createdBy", "restaurant", "contacts", "callSchedules", "interactions"],
    });
  }

  async findByKeyAccountManager(userId: string) {
    return await this.repository.find({
      where: {
        keyAccountManager: { id: userId }
      },
      relations: ["keyAccountManager", "createdBy", "restaurant", "contacts", "callSchedules", "interactions"],
    });
  }

  async findAll() {
    return await this.repository.find({
      relations: ["keyAccountManager", "createdBy", "restaurant", "contacts", "callSchedules", "interactions"],
    });
  }

  async findInteractionsByLeadId(leadId: string) {
    const lead = await this.repository.findOne({
      where: { id: leadId },
      relations: ["interactions"], // Fetch related interactions
    });

    // Check if the lead exists and return its interactions
    if (lead) {
      return lead.interactions;
    }
    return null; // Return null if no lead is found with the provided ID
  }

  async findCallSchedulesByLeadId(leadId: string) {
    const lead = await this.repository.findOne({
      where: { id: leadId },
      relations: ["callSchedules"], // Fetch related call schedules
    });

    // Check if the lead exists and return its callSchedules
    if (lead) {
      return lead.callSchedules;
    }
    return null; // Return null if no lead is found with the provided ID
  }

  async createLead(
    name: string,
    status: 'new' | 'contacted' | 'interested' | 'converted' | 'inactive',
    leadSource: string,
    keyAccountManager: User,
    createdBy: User,
    restaurantId: string,
    notes?: string
  ): Promise<Lead> {
    // Find the restaurant by ID
    const restaurant = await AppDataSource.getRepository(Restaurant).findOne({
      where: { id: restaurantId }
    });

    if (!restaurant) {
      throw new NotFoundError("Restaurant not found");
    }

    // Create the lead instance
    const newLead = this.repository.create({
      name,
      status,
      leadSource,
      keyAccountManager,
      createdBy,
      restaurant,
      notes: notes || null,
    });

    // Save the new lead to the database
    debugger;
    return this.repository.save(newLead);
  }

  async updateLeadStatus(leadId: string, status: 'new' | 'contacted' | 'interested' | 'converted' | 'inactive'): Promise<Lead | null> {
    // Find the lead by ID
    const lead = await this.repository.findOne({
      where: { id: leadId },
    });

    if (!lead) {
      return null; // If lead doesn't exist, return null
    }

    // Update the lead's status
    lead.status = status;

    // Save the updated lead to the database
    return await this.repository.save(lead);
  }

  async reassignManager(leadId: string, newKeyAccountManagerId: string): Promise<Lead | null> {
    // Find the lead by ID
    const lead = await this.repository.findOne({
      where: { id: leadId },
    });

    if (!lead) {
      return null; // If lead doesn't exist, return null
    }

    // Find the new key account manager (user) by ID
    const newKeyAccountManager = await AppDataSource.getRepository(User).findOne({
      where: { id: newKeyAccountManagerId },
    });

    if (!newKeyAccountManager) {
      return null; // If user doesn't exist, return null
    }

    // Update the lead's keyAccountManager field
    lead.keyAccountManager = newKeyAccountManager;

    // Save the updated lead to the database
    return await this.repository.save(lead);
  }

  async save(lead: Lead): Promise<Lead> {
    return await this.repository.save(lead); // Save the updated lead
  }

  async softDeleteById(id: string): Promise<boolean> {
    try {
      const lead = await this.findById(id);
      if(lead)
      {
        const result = await this.repository.softRemove(lead);
        return true;
      }
      else {
        throw new NotFoundError("Lead not found");
      }
    } catch (error) {
      console.error("Error soft deleting restaurant:", error);
      throw error;
    }
  }
}
