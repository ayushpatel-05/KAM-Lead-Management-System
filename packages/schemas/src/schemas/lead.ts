import { z } from "zod";

export const CreateLeadSchema = z.object({
    name: z.string().min(1, "Lead name is required"),
    status: z.enum(['new', 'contacted', 'interested', 'converted', 'inactive'], {
      errorMap: () => ({ message: "Invalid status" }),
    }),
    leadSource: z.string().min(1, "Lead source is required"),
    restaurantId: z.string().uuid("Invalid restaurant ID format"),
    notes: z.string().optional(),
  });

export const UpdateLeadStatusSchema = z.object({
status: z.enum(['new', 'contacted', 'interested', 'converted', 'inactive'], {
    errorMap: () => ({ message: "Invalid status value" }),
}),
});

export const LeadIdSchema = z.object({
    id: z.string().uuid("Invalid lead id")
});

export const ReassignManagerSchema = z.object({
    newKeyAccountManagerId: z.string().uuid("Invalid user ID format"), // Validate the user ID format
});

export const UpdateLeadSchema = z.object({
  name: z.string().min(1).max(255).optional(), // Name is optional, but if provided, must be a non-empty string
  notes: z.string().max(255).optional(), // Notes are optional, but if provided, must be a string
  leadSource: z.string().max(255).optional(), // LeadSource is optional, but if provided, must be a string
});

export const LeadResponseSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1, "Lead name is required"),
    status: z.enum(['new', 'contacted', 'interested', 'converted', 'inactive'], {
      errorMap: () => ({ message: "Invalid status" }),
    }),
    leadSource: z.string().min(1, "Lead source is required"),
    notes: z.string().optional(),
    keyAccountManager: z.optional(
      z.object({
        id: z.string().uuid(),
        firstName: z.string(),
        lastName: z.string(),
        phone: z.string().optional(),
        email: z.string().email(),
        role: z.string(),
      })
    ).nullable(),
    createdBy: z.optional(
      z.object({
        id: z.string().uuid(),
        firstName: z.string(),
        lastName: z.string(),
        phone: z.string().optional(),
        email: z.string().email(),
        role: z.string(),
      })
    ).nullable(),
    restaurant: z.optional(
      z.object({
        id: z.string().uuid(),
        name: z.string(),
      })
    ).nullable(),
  });

export type CreateLeadPayload = z.infer<typeof CreateLeadSchema>;
export type UpdateLeadStatusPayload = z.infer<typeof UpdateLeadStatusSchema>;
export type ReassignLeadPayload = z.infer<typeof ReassignManagerSchema>;
export type UpdateLeadPayload = z.infer<typeof UpdateLeadSchema>;
export type CreateLeadResponse = z.infer<typeof LeadResponseSchema>;