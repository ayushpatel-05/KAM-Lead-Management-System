import { z } from 'zod';
import { CallIntent, CallScheduleStatus, CallScheduleType } from '../types';

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


export const CallScheduleFilterSchema = z.object({
  id: z.string().uuid().optional(),
  type: z.nativeEnum(CallScheduleType).optional(),
  datetime: z.date().optional(),
  status: z.nativeEnum(CallScheduleStatus).optional(),
  intent: z.nativeEnum(CallIntent).optional(),
  notes: z.string().optional(),
  otherIntent: z.string().optional(),
  leadId: z.string().uuid().optional(),
  contactId: z.string().uuid().optional(),
});

export const CallScheduleGetAllQuerySchema = CallScheduleFilterSchema.extend({
    page: z.number().min(1).default(1).optional(), 
    size: z.number().min(1).max(100).default(10).optional(), 
});

export const CreateCallScheduleSchema = z.object({
    type: z.nativeEnum(CallScheduleType).default(CallScheduleType.FIXED), 
    // datetime: z.date(),
    datetime: z.preprocess((arg) => {
      // Transform string to Date object if it's a valid ISO string
      return typeof arg === "string" ? new Date(arg) : arg;
    }, z.date()),
    status: z.nativeEnum(CallScheduleStatus).default(CallScheduleStatus.SCHEDULED),
    intent: z.nativeEnum(CallIntent),
    notes: z.string().optional(),
    otherIntent: z.string().optional(),
    leadId: z.string().uuid(),
    contactId: z.string().uuid(),
});

export const UpdateCallScheduleSchema = z.object({
    type: z.nativeEnum(CallScheduleType).default(CallScheduleType.FIXED).optional(), 
    datetime: z.date().optional(),
    status: z.nativeEnum(CallScheduleStatus).default(CallScheduleStatus.SCHEDULED).optional(),
    intent: z.nativeEnum(CallIntent).optional(),
    notes: z.string().optional(),
    otherIntent: z.string().optional(),
    // leadId: z.string().uuid()
})

export const CallScheduleResponseSchema = z.object({
  id: z.string().uuid(),
  type: z.nativeEnum(CallScheduleType),
  datetime: z.date(),
  status: z.nativeEnum(CallScheduleStatus),
  intent: z.nativeEnum(CallIntent),
  notes: z.string().optional().nullable(),
  otherIntent: z.string().optional().nullable(),
  lead: LeadSchema.optional(),
  contact: ContactSchema.optional(),
})

export type GetAllCallSchedulePayload = z.infer<typeof CallScheduleFilterSchema>;
export type GetAllCallSchedulePaginatedPayload = z.infer<typeof CallScheduleGetAllQuerySchema>;
export type CreateCallSchedulePayload = z.infer<typeof CreateCallScheduleSchema>;
export type UpdateCallSchedulePayload = z.infer<typeof UpdateCallScheduleSchema>;
export type CallScheduleResponse = z.infer<typeof CallScheduleResponseSchema>;
