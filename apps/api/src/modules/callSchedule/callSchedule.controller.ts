import { NextFunction, Response } from "express";
import { CallScheduleService } from "./callSchedule.service";
import { ExtendedRequest } from "../../types/ExtendedRequest";
import { CallScheduleGetAllQuerySchema, CreateCallScheduleSchema, UpdateCallScheduleSchema } from "@repo/schemas";

export class CallScheduleController {
  private callScheduleService: CallScheduleService;

  constructor() {
    this.callScheduleService = new CallScheduleService();
  }

  async getCallScheduleById(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        const { callSchedule } = await this.callScheduleService.getCallScheduleById(id);

        res.status(200).json({ message: "Call Schedule found", data: {callSchedule: this.callScheduleService.sanitizeCallSchedule(callSchedule)} });
    } catch (error: any) {
      next(error);
    }
  }

  async getAllCallSchedules(req: ExtendedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        const {page, size, ...filterData} = CallScheduleGetAllQuerySchema.parse(req.query);
        const result = await this.callScheduleService.getAllCallSchedule(filterData, page, size);

        res.status(200).json({message: "Call Schedules fetched", data: {
            data: {
                callSchedules: this.callScheduleService.sanitizeCallSchedule(result[0]),
                count: (result[1])
            }
        }})
    }
    catch(error: any) {
        next(error)
    }
  }


  async createCallSchedule(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
        const parsedData = CreateCallScheduleSchema.parse(req.body);
        const transformedData = this.callScheduleService.transformToCallSchedule(parsedData);
        const callSchedule = await this.callScheduleService.create(transformedData, req.lead!, req.contact!);

        res.status(201).json({message: "Call Schedule Created Succesfully", data: this.callScheduleService.sanitizeCallSchedule(callSchedule)});
    }
    catch(error: any) {
      next(error);
    }
  }

  async updateCallSchedule(req: ExtendedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const parsedData = UpdateCallScheduleSchema.parse(req.body);
      const transformedData = this.callScheduleService.transformToCallSchedule(parsedData);
      const updatedCallSchedule = await this.callScheduleService.updateCallSchedule(id, transformedData);

      res.status(200).json({message: "Call Schedule updated", data: this.callScheduleService.sanitizeCallSchedule(updatedCallSchedule)});
    } catch (error: any) {
      console.error('Error in updateRestaurant:', error);
      next(error);
    }
  }

  async deleteCallSchedule(req: ExtendedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await this.callScheduleService.deleteCallSchedule(id);

      res.status(204).send();
    } catch (error: any) {
      console.error('Error in deleteRestaurant:', error);
      next(error);
    }
  }
}
