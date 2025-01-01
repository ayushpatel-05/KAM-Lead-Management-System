import { LeadRepository } from "./lead.repository";
import { LeadResponseSchema } from "@repo/schemas";
import { User, Lead } from "@repo/db";
import { NotFoundError, UnauthorizedError } from "../../utils/api-errors";
import { UserRepository } from "../user/user.repository";

export class LeadService {
  private leadRepository: LeadRepository;
  private userRepository: UserRepository

  constructor() {
    this.leadRepository = new LeadRepository();
    this.userRepository = new UserRepository();
  }

  async getLeadById(id: string) {
    return await this.leadRepository.findById(id);
  }

  async getAllLeads(userId: string) {
    return await this.leadRepository.findByKeyAccountManager(userId);
  }

  async getLeadInteractions(leadId: string) {
    return await this.leadRepository.findInteractionsByLeadId(leadId);
  }

  async getLeadCallSchedules(leadId: string) {
    return await this.leadRepository.findCallSchedulesByLeadId(leadId);
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
    return await this.leadRepository.createLead(
      name,
      status,
      leadSource,
      keyAccountManager,
      createdBy,
      restaurantId,
      notes
    );
  }

  async updateLeadStatus(leadId: string, status: 'new' | 'contacted' | 'interested' | 'converted' | 'inactive'): Promise<Lead | null> {
    return await this.leadRepository.updateLeadStatus(leadId, status);
  }

  async reassignManager(leadId: string, newKeyAccountManagerId: string, authenticatedUserId: string): Promise<Lead | null> {
    // Check if the lead is owned by the authenticated user
    const lead = await this.leadRepository.findById(leadId);
    console.log(lead);
    console.log("The authenticated user id is: ", authenticatedUserId);
    if (!lead || lead.keyAccountManager.id !== authenticatedUserId) {
      return null; // Return null if the lead is not found or not owned by the authenticated user
    }

    // Check if the new key account manager exists
    const user = await this.userRepository.findById(newKeyAccountManagerId);
    if (!user) {
      return null; // User not found
    }
    console.log(newKeyAccountManagerId);
    // Reassign the manager on the lead
    return await this.leadRepository.reassignManager(leadId, newKeyAccountManagerId);
  }

  async updateLead(leadId: string, updateData: any, authenticatedUserId: string): Promise<Lead | null> {
    // Check if the lead exists and is owned by the authenticated user
    const lead = await this.leadRepository.findById(leadId);
    if (!lead || lead.createdBy.id !== authenticatedUserId) {
      return null; // Return null if the lead is not found or not owned by the authenticated user
    }

    // Update the lead fields if they are provided in the request body
    if (updateData.name) {
      lead.name = updateData.name;
    }
    if (updateData.notes) {
      lead.notes = updateData.notes;
    }
    if (updateData.leadSource) {
      lead.leadSource = updateData.leadSource;
    }
    if (updateData.contacts) {
      lead.contacts = updateData.contacts; // Assuming this is an array of contacts
    }

    // Save the updated lead to the database
    return await this.leadRepository.save(lead);
  }

  async deleteLead(leadId: string, authenticatedUserId: string): Promise<boolean> {
    // Check if the lead exists and is owned by the authenticated user
    const lead = await this.leadRepository.findById(leadId);
  
    if (!lead) {
      throw new NotFoundError("Lead not found");
    }
  
    if (lead.keyAccountManager.id !== authenticatedUserId) {
      throw new UnauthorizedError("You are not authorized to delete this lead");
    }
  
    // Use the softDeleteById method for soft-deleting the lead
    return await this.leadRepository.softDeleteById(leadId);
  }

  sanitizeLead(leadOrLeadss: Lead | Lead[]) {
    if (Array.isArray(leadOrLeadss)) {
      return leadOrLeadss.map((lead) => {
        return LeadResponseSchema.parse(lead);
      });
    } else {
      return LeadResponseSchema.parse(leadOrLeadss);
    }
  }

}
