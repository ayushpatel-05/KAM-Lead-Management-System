import { ContactResponseSchema } from "@repo/schemas";
import { LeadRepository } from "../lead/lead.repository"; // Assuming Lead repository exists
import { ContactRepository } from "./contact.repository"; // Assuming Contact repository exists
// import { Contact } from "../entities/Contact";
// import { Lead } from "../entities/Lead"; // Lead entity
// import { User } from "../entities/User"; // Assuming User entity exists
import { Contact } from "@repo/db";

export class ContactService {
    private contactRepository: ContactRepository;
    private leadRepository: LeadRepository
  constructor() {
    this.contactRepository = new ContactRepository();
    this.leadRepository = new LeadRepository();
  }

  async createContact(leadId: string, contactData: any, authenticatedUserId: string): Promise<Contact | null> {
    // Check if the lead exists
    const lead = await this.leadRepository.findById(leadId);
    if (!lead) {
      return null; // Return null if the lead doesn't exist
    }

    // // Create a new Contact instance and populate fields
    // const newContact = new Contact();
    // newContact.name = contactData.name;
    // newContact.role = contactData.role || null; // Optional field
    // newContact.phone = contactData.phone || null; // Optional field
    // newContact.email = contactData.email || null; // Optional field
    // newContact.notes = contactData.notes || null; // Optional field
    // newContact.timezone = contactData.timezone;
    // newContact.lead = lead; // Link the contact to the lead

    const newContact = await this.contactRepository.create(contactData);

    // Save the new contact to the database
    return await this.contactRepository.save(newContact);
  }

    sanitizeContact(contactOrContacts: Contact | Contact[]) {
      if (Array.isArray(contactOrContacts)) {
        return contactOrContacts.map((contact) => {
          return ContactResponseSchema.parse(contact);
        });
      } else {
        return ContactResponseSchema.parse(contactOrContacts);
      }
    }
}
