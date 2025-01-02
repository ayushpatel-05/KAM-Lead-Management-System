import { CallScheduleRepository } from "./callSchedule.repository";
import { CallIntent, CallScheduleResponseSchema, CallScheduleStatus, CallScheduleType, CreateCallSchedulePayload, GetAllCallSchedulePayload, UpdateCallSchedulePayload } from "@repo/schemas";
import { CallSchedule, Contact, Lead} from "@repo/db";
import { BadRequestError, InternalServerError } from "../../utils/api-errors";

export class CallScheduleService {
  private callScheduleRepository: CallScheduleRepository;

  constructor() {
    this.callScheduleRepository = new CallScheduleRepository();
  }

  async getCallScheduleById(id: string) {
    const callSchedule = await this.callScheduleRepository.findById(id);
    if (!callSchedule) {
      throw new BadRequestError("Call Schedule does not exist");
    }

    return { callSchedule };
  }


  async getAllCallSchedule(filterData: GetAllCallSchedulePayload, page?: number, size?: number) {
    const result = await this.callScheduleRepository.findAll(filterData, page, size);

    return result;
  }

  async create(callScheduleData: Partial<CallSchedule>, lead: Lead, contact: Contact): Promise<CallSchedule> {
    try {

      const callSchedule = await this.callScheduleRepository.create(callScheduleData, lead, contact);
      return await this.callScheduleRepository.save(callSchedule);
    } catch (error) {
      console.error('Error creating restaurant:', error);
      throw error;
    }
  }

   /**
   * Update a call schedule entity.
   * @param id - The call schedule ID to update.
   * @param restaurantData - Partial data for the call schedule.
   * @returns The updated call schedule entity.
   */
   async updateCallSchedule(id: string, callScheduleData: Partial<CallSchedule>): Promise<CallSchedule> {
    const restaurant = await this.callScheduleRepository.update(id, callScheduleData);
    return restaurant;
  }

  /**
   * Soft delete a call schedule by ID.
   * @param id - The call schedule ID to delete.
   */
  async deleteCallSchedule(id: string): Promise<void> {
    const result = await this.callScheduleRepository.softDeleteById(id);
    if(!result) {
        throw new InternalServerError("Some error occured")
    }
    return;
  }

  sanitizeCallSchedule(callScheduleOrCallSchedules: CallSchedule | CallSchedule[]) {
    console.log(callScheduleOrCallSchedules);
    if (Array.isArray(callScheduleOrCallSchedules)) {
      return callScheduleOrCallSchedules.map((restaurant) => {
        return CallScheduleResponseSchema.parse(restaurant);
      });
    } else {
      return CallScheduleResponseSchema.parse(callScheduleOrCallSchedules);
    }
  }

  transformToCallSchedule(data: CreateCallSchedulePayload | UpdateCallSchedulePayload): Partial<CallSchedule> {
    return {
      ...data,
      type: data.type ? (data.type as CallScheduleType) : undefined,
      status: data.status ? (data.status as CallScheduleStatus) : undefined,
      intent: data.intent ? (data.intent as CallIntent) : undefined,
      notes: data.notes || null,
      otherIntent: data.otherIntent || null,
      datetime: data.datetime ? new Date(data.datetime) : undefined, // Ensure datetime is a Date object
    };
  }

}
