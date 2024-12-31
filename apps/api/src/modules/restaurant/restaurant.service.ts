import { RestaurantRepository } from "./restaurant.repository";
import bcrypt from "bcrypt";
import { LoginPayload, BackendRegisterPayload, UserSchema, RestaurantResponseSchema } from "@repo/schemas";
import { Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "@repo/schemas";
import { Address, Restaurant, User as UserDB } from "@repo/db";
import { BadRequestError, InternalServerError, NotFoundError } from "../../utils/api-errors";

export class RestaurantService {
  private restaurantRepository: RestaurantRepository;

  constructor() {
    this.restaurantRepository = new RestaurantRepository();
  }

  async getRestaurantById(id: string) {
    const restaurant = await this.restaurantRepository.findById(id);
    if (!restaurant) {
      throw new BadRequestError("Restaurant does not exist");
    }

    return { restaurant };
  }

  async getRestaurantsByUser(id: string, page?: number, size?: number) {
    // debugger;
    console.log(id);
    const restaurant = await this.restaurantRepository.findAll({user: id}, page, size);

    return { restaurant };
  }

  async getAllRestaurants() {
    const restaurant = await this.restaurantRepository.findAll({});

    return { restaurant };
  }

  async create(restaurantData: Partial<Restaurant>, user: UserDB, addressData?: Partial<Address>): Promise<Restaurant> {
    try {
      const restaurant = addressData ? await this.restaurantRepository.create(restaurantData, user, addressData) : await this.restaurantRepository.create(restaurantData, user);
      return await this.restaurantRepository.save(restaurant);
    } catch (error) {
      console.error('Error creating restaurant:', error);
      throw error;
    }
  }

   /**
   * Update a restaurant entity.
   * @param id - The restaurant ID to update.
   * @param restaurantData - Partial data for the restaurant.
   * @param addressData - Partial data for the address.
   * @returns The updated restaurant entity.
   */
   async updateRestaurant(id: string, restaurantData: Partial<Restaurant>, addressData?: Partial<Address>): Promise<Restaurant> {
    //As of now anyone can update the restaurant since it is not tied strictly to the user
    const restaurant = await this.restaurantRepository.update(id, restaurantData, addressData);
    return restaurant;
  }

  /**
   * Soft delete a restaurant by ID.
   * @param id - The restaurant ID to delete.
   */
  async deleteRestaurant(id: string): Promise<void> {
    const result = await this.restaurantRepository.softDeleteById(id);
    if(!result) {
        throw new InternalServerError()
    }
    return;
  }

  sanitizeRestaurant(restaurantOrRestaurants: Restaurant | Restaurant[]) {
    if (Array.isArray(restaurantOrRestaurants)) {
      return restaurantOrRestaurants.map((restaurant) => {
        return RestaurantResponseSchema.parse(restaurant);
      });
    } else {
      return RestaurantResponseSchema.parse(restaurantOrRestaurants);
    }
  }

}
