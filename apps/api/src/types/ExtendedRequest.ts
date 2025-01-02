import { CallSchedule, Contact, Lead, User } from "@repo/db";
import { Request } from "express";

export interface ExtendedRequest extends Request {
    user?: User; // Optional user property
    lead?: Lead;
    contact?: Contact;
    callSchedule?: CallSchedule;
  }