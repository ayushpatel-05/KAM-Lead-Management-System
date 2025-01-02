import { z } from "zod";
import { InteractionMethod, InteractionSubType, InteractionType, Outcome } from "../types";

// Define the InteractionFilterSchema
export const InteractionFilterSchema = z.object({
    interactionType: z.string().optional(),
    interactionSubtype: z.string().optional(),
    interactionMethod: z.string().optional(),
    callDuration: z
      .object({
        time: z.number(),
        greaterThan: z.boolean().optional(),
      })
      .optional(),
    details: z.string().optional(),
    // dateRange: z
    //   .object({
    //     startDate: z
    //       .union([z.string(), z.date()])
    //       .transform((value) => (typeof value === "string" ? new Date(value) : value)),
    //     endDate: z
    //       .union([z.string(), z.date()])
    //       .transform((value) => (typeof value === "string" ? new Date(value) : value)),
    //   })
    //   .optional(),
    startDate: z
        .union([z.string(), z.date()])
        .transform((value) => (typeof value === "string" ? new Date(value) : value)).optional(),
    endDate: z
        .union([z.string(), z.date()])
        .transform((value) => (typeof value === "string" ? new Date(value) : value)).optional(),
    outcome: z.string().optional(),
    leadId: z.string().uuid().optional(),
    contactId: z.string().uuid().optional(),
    createdBy: z.string().uuid().optional(),
  });

// Extend the InteractionFilterSchema for pagination and query parameters
export const InteractionGetAllQuerySchema = InteractionFilterSchema.extend({
  page: z.number().min(1).default(1).optional(),
  size: z.number().min(1).max(100).default(10).optional(),
});


// export const InteractionUpdateSchema = z.object({
//     interactionType: z.enum(['call', 'order']).optional(),
//     interactionSubtype: z
//       .enum(['initial', 'follow-up', 'feedback', 'new order', 'repeat order'])
//       .optional(),
//     interactionMethod: z.enum(['phone', 'email', 'chat', 'in-person']).optional(),
//     callDuration: z.number().nullable().optional(),
//     orderAmount: z.number().nullable().optional(),
//     details: z.string().optional(),
//     interactionDate: z.date().optional(),
//     outcome: z.enum(['positive', 'neutral', 'negative']).optional(),
// });

export const CreateInteractionSchema = z.object({
    interactionType: z.nativeEnum(InteractionType),
    interactionSubtype: z.nativeEnum(InteractionSubType).optional(),
    interactionMethod: z.nativeEnum(InteractionMethod),
    callDuration: z
        .union([z.number(), z.string()])
        .transform((value) => (typeof value === "string" ? parseInt(value) : value))
        .optional(),
    details: z.string().optional(),
    interactionDate: z
        .union([z.string(), z.date()])
        .transform((value) => (typeof value === "string" ? new Date(value) : value)),
    leadId: z.string().uuid(),
    contactId: z.string().uuid(),
    outcome: z.nativeEnum(Outcome)
});

export const UpdateInteractionSchema = z.object({
    interactionType: z.nativeEnum(InteractionType).optional(),
    interactionSubtype: z.nativeEnum(InteractionSubType).optional(),
    interactionMethod: z.nativeEnum(InteractionMethod).optional(),
    callDuration: z
        .union([z.number(), z.string()])
        .transform((value) => (typeof value === "string" ? parseInt(value) : value))
        .optional(),
    details: z.string().optional(),
    interactionDate: z
        .union([z.string(), z.date()])
        .transform((value) => (typeof value === "string" ? new Date(value) : value))
        .optional(),
    outcome: z.nativeEnum(Outcome).optional(),
});




const UserSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  role: z.string(),
});

const LeadSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  status: z.enum(['new', 'contacted', 'interested', 'converted', 'inactive']),
  leadSource: z.string(),
  notes: z.string().optional().nullable(),
});

const ContactSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  role: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  notes: z.string().optional().nullable(),
  timezone: z.string(),
});

export const InteractionResponseSchema = z.object({
  id: z.string().uuid(),
  interactionType: z.nativeEnum(InteractionType),
  interactionSubtype: z.nativeEnum(InteractionSubType).optional().nullable(),
  interactionMethod: z.nativeEnum(InteractionMethod),
  callDuration: z.number().int().positive().optional().nullable(), // Ensures positive integer for call duration
  details: z.string().optional().nullable(),
  interactionDate: z.preprocess((arg) => (typeof arg === 'string' ? new Date(arg) : arg), z.date()),
  user: UserSchema.optional().nullable(),
  lead: LeadSchema.optional().nullable(),
  contact: ContactSchema.optional().nullable(),
  outcome: z.nativeEnum(Outcome),
});




export type GetAllInteractionPayload = z.infer<typeof InteractionFilterSchema>
export type GetAllInteractionPaginatedPayload = z.infer<typeof InteractionGetAllQuerySchema>
export type CreateInteractionPayload = z.infer<typeof CreateInteractionSchema>
export type UpdateInteractionPayload = z.infer<typeof UpdateInteractionSchema>
export type InteractionResponse = z.infer<typeof InteractionResponseSchema>