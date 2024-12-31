import { NextFunction, Request, Response } from "express";
import { RestaurantService } from "./restaurant.service";
import { ExtendedRequest } from "../../middleware/authMiddleware";
import { AccessDeniedError } from "../../utils/api-errors";
import { paginationQuerySchema, RestaurantResponseSchema, RestaurantSchema, UpdateRestaurantSchema } from "@repo/schemas";

export class RestaurantController {
  private restaurantService: RestaurantService;

  constructor() {
    this.restaurantService = new RestaurantService();
  }

  async getRestaurantById(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        const { restaurant } = await this.restaurantService.getRestaurantById(id);

        res.status(200).json({ message: "Restaurant found", data: {restaurant: this.restaurantService.sanitizeRestaurant(restaurant)} });
    } catch (error: any) {
      next(error);
    }
  }

  async getRestaurantsByUser(req: ExtendedRequest, res: Response, next: NextFunction) {
    debugger;
    try { 
        if(!req.user)next(new AccessDeniedError("Invalid user"))
        else {
            const id = req.user?.id
            const {page, size} = paginationQuerySchema.parse(req.query);

            const result = await this.restaurantService.getRestaurantsByUser(id, page, size);
            res.status(201).json({ message: "Restaurants found", data: {
                restaurant: this.restaurantService.sanitizeRestaurant(result.restaurant[0]),
                count: result.restaurant[1]
            } });
        }
    } catch (error: any) {
      next(error);
    }
  }

  async getAllRestaurants(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
        const result = await this.restaurantService.getAllRestaurants();
        res.status(201).json({ message: "Restaurants found", data: {
            restaurant: this.restaurantService.sanitizeRestaurant(result.restaurant[0]),
            count: result.restaurant[1]
        } });
    }
    catch(error: any) {
      next(error);
    }
  }

  async createRestaurant(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
        const parsedData = RestaurantSchema.parse(req.body);
        const { address, ...restaurantData } = parsedData;

        const newRestaurant = await this.restaurantService.create(restaurantData, req.user!, address);

        res.status(201).json({message: "Restaurant Created Succesfully",restaurant: this.restaurantService.sanitizeRestaurant(newRestaurant)});
    }
    catch(error: any) {
      next(error);
    }
  }

//   async updateRestaurant(req: ExtendedRequest, res: Response, next: NextFunction) {
//     try {
//     }
//     catch(error: any) {
//       next(error);
//     }
//   }

//   async deleteRestaurant(req: ExtendedRequest, res: Response, next: NextFunction) {
//     try {
//     }
//     catch(error: any) {
//       next(error);
//     }
//   }

async updateRestaurant(req: ExtendedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const parsedData = UpdateRestaurantSchema.parse(req.body);

      const { address, ...restaurantData } = parsedData;
      const updatedRestaurant = await this.restaurantService.updateRestaurant(id, restaurantData, address);

      res.status(200).json({message: "Restaurant updated", data: {
        restaurant: this.restaurantService.sanitizeRestaurant(updatedRestaurant)
      }});
    } catch (error: any) {
      console.error('Error in updateRestaurant:', error);
      next(error);
    }
  }

  async deleteRestaurant(req: ExtendedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await this.restaurantService.deleteRestaurant(id);

      res.status(204).send();
    } catch (error: any) {
      console.error('Error in deleteRestaurant:', error);
      next(error);
    }
  }
}
