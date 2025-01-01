import { AppDataSource } from "@repo/db";
import { Contact } from "@repo/db";

export class ContactRepository {
  private contactRepository = AppDataSource.getRepository(Contact);

  // Create a new Contact instance
  async create(contactData: Partial<Contact>): Promise<Contact> {
    const newContact = this.contactRepository.create(contactData); // Create instance with provided data
    return newContact; 
  }

  // Save the contact (either new or existing)
  async save(contact: Contact): Promise<Contact> {
    return this.contactRepository.save(contact); // Save the contact to the database
  }

  // Find a contact by its id
  async findById(id: string): Promise<Contact | null> {
    return this.contactRepository.findOne({ where: { id: id } }); // Find by contact_id
  }

  // Check if the contact exists by ID, create if not, and save
  async findOrCreate(contactId: string, contactData: Partial<Contact>): Promise<Contact> {
    let contact = await this.findById(contactId); // First, try to find the contact

    // If contact does not exist, create a new one and save it
    if (!contact) {
      contact = await this.create(contactData);
      contact = await this.save(contact);
    }

    return contact; // Return the contact (either found or created)
  }
}
