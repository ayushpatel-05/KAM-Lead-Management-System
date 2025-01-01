import { z } from "zod";

export const CreateContactSchema = z.object({
  name: z.string().min(1).max(255), // Required: name of the contact
  role: z.string().max(100).optional(), // Optional: role of the contact
  phone: z.string().max(20).optional(), // Optional: phone number of the contact
  email: z.string().email().max(255).optional(), // Optional: email of the contact
  notes: z.string().max(255).optional(), // Optional: notes for the contact
  timezone: z.string().max(50), // Required: timezone
});

export const ContactResponseSchema = z.object({
    name: z.string().min(1, "Contact name is required"),
    role: z.string().optional().nullable(), // Can be null or string
    phone: z.string().optional().nullable(), // Can be null or string
    email: z.string().email("Invalid email").nullable(), // Can be null but must be valid email if provided
    notes: z.string().optional().nullable(), // Can be null or string
    timezone: z.string().max(50, "Timezone length exceeded"), // Must be exactly 50 characters
    leadId: z.string().uuid().optional().nullable(), // Optional lead ID (nullable)
  });

export type CreateContactPayload = z.infer<typeof CreateContactSchema>;
export type ContactResponse = z.infer<typeof ContactResponseSchema>;