import { NextFunction, Response } from "express";
import { LeadService } from "./lead.service";
import { ExtendedRequest } from "../../middleware/authMiddleware";
import { NotFoundError } from "../../utils/api-errors";
import { CreateContactSchema, CreateLeadSchema, LeadIdSchema, ReassignManagerSchema, UpdateLeadSchema, UpdateLeadStatusSchema } from "@repo/schemas";
import { ContactService } from "../contact/contact.service";

export class LeadController {
  private leadService: LeadService;
  private contactService: ContactService;

  constructor() {
    this.leadService = new LeadService();
    this.contactService = new ContactService();
  }

  async getLeadById(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = LeadIdSchema.parse(req.params);
      const lead = await this.leadService.getLeadById(id);
      if (!lead) {
        throw new NotFoundError("Lead not found");
      }
      res.status(200).json({message: "Lead fetched succesfully", data: this.leadService.sanitizeLead(lead)});
    } catch (error) {
      next(error);
    }
  }

  async getAllLeads(req: ExtendedRequest, res: Response, next: NextFunction) {//Improve the service logic to only fetch the basic details
    try {
        const userId = req.user?.id;  // Assuming the user ID is available in req.user
        const leads = await this.leadService.getAllLeads(userId!);
        res.status(200).json({message: "Leads fetched succesfully", data: this.leadService.sanitizeLead(leads)});
      } catch (error) {
        next(error);
    }
  }

  async getLeadInteractions(req: ExtendedRequest, res: Response, next: NextFunction) {//TODO: Sanatize later
    try {
        const { id } = LeadIdSchema.parse(req.params); // Extract the leadId from the request parameters
        const interactions = await this.leadService.getLeadInteractions(id);
        if (!interactions) {
          throw new NotFoundError("No interactions found for this lead");
        }
        res.status(200).json({message: "Interactions fetched succesfully", data: interactions});
      } catch (error) {
        next(error);
      }
  }

  async getLeadCallSchedules(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
        const { id } = req.params; // Extract the leadId from the request parameters
        const callSchedules = await this.leadService.getLeadCallSchedules(id);
        if (!callSchedules) {
            throw new NotFoundError("No call schedules found for this lead")
        }
        res.status(200).json({message: "Call Schedules fetched successfully", data: callSchedules});
      } catch (error) {
        next(error);
    }
  }

  async createLead(req: ExtendedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        // Validate the request body using Zod schema
        const parsedBody = CreateLeadSchema.parse(req.body);
  
        // Extract the necessary fields from the parsed body and user
        const { name, status, leadSource, notes } = parsedBody;
        const { restaurantId } = req.body; // Assumes restaurantId is passed in the body
  
        // Create the lead
        const newLead = await this.leadService.createLead(
          name,
          status,
          leadSource,
          req.user!,
          req.user!,
          restaurantId,
          notes
        );
  
        // Send response with the created lead
        res.status(201).json({message: "Lead Created Successfully" ,data: this.leadService.sanitizeLead(newLead)});
      } catch (error) {
        next(error);
      }
  }

  async updateLeadStatus(req: ExtendedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        // Validate the request body using Zod schema
        const parsedBody = UpdateLeadStatusSchema.parse(req.body);
        
        const { id } = LeadIdSchema.parse(req.params); // Extract the leadId from the request parameters
        const { status } = parsedBody; // Extract the status from the parsed body
        console.log("The id is: ", id, status);
        // Update the lead status
        const updatedLead = await this.leadService.updateLeadStatus(id, status);
        if (!updatedLead) {
            res.status(404).json({ message: "Lead not found" });
        }
        else {
            // Send response with the updated lead
            res.status(200).json({message: "Lead status updated", data: this.leadService.sanitizeLead(updatedLead)});
        }
      } catch (error) {
        next(error);
      }
  }

  async reassignManager(req: ExtendedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        // Validate the request body using Zod schema
        const parsedBody = ReassignManagerSchema.parse(req.body);
        
        const { id } = req.params; // Extract the leadId from the request parameters
        const { newKeyAccountManagerId } = parsedBody; // Extract the new key account manager user ID from the body
        const authenticatedUserId = req.user?.id; // Get the authenticated user ID
        console.log(req.user);
        // Reassign the manager
        const updatedLead = await this.leadService.reassignManager(id, newKeyAccountManagerId, authenticatedUserId!);
        if (!updatedLead) {
            throw new NotFoundError("Lead or new key account manager not found, or you do not have permission to reassign this lead");
            // res.status(404).json({ message: "" });
        }
        else {
            // Send response with the updated lead
            res.status(200).json({message: "Lead reassigned successfully", data: this.leadService.sanitizeLead(updatedLead)});
        }
  
      } catch (error) {
        next(error);
      }
  }

  async updateLead(req: ExtendedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        // Validate the request body using Zod schema
        const parsedBody = UpdateLeadSchema.parse(req.body);
        
        const { id } = req.params; // Extract the leadId from the request parameters
        const authenticatedUserId = req.user?.id; // Get the authenticated user ID
  
        // Update the lead
        const updatedLead = await this.leadService.updateLead(id, parsedBody, authenticatedUserId!);
        if (!updatedLead) {
            res.status(404).json({ message: "Lead not found or you do not have permission to update this lead" });
        }
        else {
            // Send response with the updated lead
            res.status(200).json({message:"Lead updated succesfully", data: this.leadService.sanitizeLead(updatedLead)});
        }
  
      } catch (error) {
        next(error);
    }
  }

  async deleteLead(req: ExtendedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        const { id } = req.params; // Extract the leadId from the request parameters
        const authenticatedUserId = req.user?.id; // Get the authenticated user ID
  
        // Delete the lead
        const deletedLead = await this.leadService.deleteLead(id, authenticatedUserId!);
        if (!deletedLead) {
            res.status(404).json({ message: "Lead not found or you do not have permission to delete this lead" });
        }
        else {
            // Send response indicating the lead was deleted
            res.status(200).json({ message: "Lead deleted successfully" });
        }
  
      } catch (error) {
        next(error);
      }
  }

  async createContact(req: ExtendedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        // Validate request body using Zod schema
        const parsedBody = CreateContactSchema.parse(req.body);
        const {id:leadId} = LeadIdSchema.parse(req.params); // Extract lead ID from params
        const authenticatedUserId = req.user?.id; // Get the authenticated user ID
  
        // Call the service to create the contact
        const createdContact = await this.contactService.createContact(leadId, parsedBody, authenticatedUserId!);
        if (!createdContact) {
            throw new NotFoundError("Lead not found or you do not have permission to add a contact");
        }
  
        // Send the created contact as a response
        res.status(201).json({message:"Contact created and added successfully", data: this.contactService.sanitizeContact(createdContact)});
      } catch (error) {
        next(error);
    }
  }
}
