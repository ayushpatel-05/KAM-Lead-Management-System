import { AppDataSource } from "@repo/db";
import { Repository, Like } from "typeorm";
import { Restaurant } from "@repo/db";
import { Address } from "@repo/db";
import { User } from "@repo/db";
import { Lead } from "@repo/db";
import { RestaurantFilter } from "./restaurant";
import { NotFoundError } from "../../utils/api-errors";

export class RestaurantRepository {
  private repository: Repository<Restaurant>;

  constructor() {
    this.repository = AppDataSource.getRepository(Restaurant);
  }

  /**
   * Find a restaurant by its unique ID, including related Address, User, and Leads.
   * @param id - The UUID of the restaurant.
   * @returns The restaurant entity or null if not found.
   */
  async findById(id: string): Promise<Restaurant | null> {
    try {
      return await this.repository.findOne({
        where: { id },
        // relations: ["address", "user", "leads"],
        relations: ["address"],//Only return restaurant and its address
      });
    } catch (error) {
      console.error("Error finding restaurant by ID:", error);
      throw error; // Re-throw to allow higher-level handling
    }
  }

  /**
   * Find a restaurant by its name, including related Address, User, and Leads.
   * @param name - The name of the restaurant.
   * @returns The restaurant entity or null if not found.
   */
  async findByName(name: string): Promise<Restaurant | null> {
    try {
      return await this.repository.findOne({
        where: { name },
        // relations: ["address", "user", "leads"],
        relations: ["address"],//Only return restaurant and its address
      });
    } catch (error) {
      console.error("Error finding restaurant by name:", error);
      throw error;
    }
  }

  /**
   * Retrieve a paginated list of restaurants with optional filters.
   * @param filters - Partial filters based on Restaurant fields.
   * @param page - The page number for pagination.
   * @param size - The number of records per page.
   * @returns A tuple containing an array of restaurants and the total count.
   */
  async findAll(
    filters: Partial<RestaurantFilter>,
    page: number = 1,
    size: number = 10
  ): Promise<[Restaurant[], number]> {
    try {
      console.log("The filter is: ", filters);
      const query = this.repository.createQueryBuilder("restaurant")
        .leftJoinAndSelect("restaurant.address", "address")
        .leftJoinAndSelect("restaurant.user", "user")
        // .leftJoinAndSelect("restaurant.leads", "leads")
        .where("restaurant.deletedDate IS NULL") // Exclude soft-deleted records
        .skip((page - 1) * size)
        .take(size);

      if (filters.name) {
        query.andWhere("restaurant.name LIKE :name", { name: `%${filters.name}%` });
      }
    //   if (filters.status) {//If status is included in restaurant level in future
    //     query.andWhere("restaurant.status = :status", { status: filters.status });
    //   }
      if (filters.user) {
        query.andWhere("restaurant.user.id = :userId", { userId: filters.user });
      }
      if (filters.address) {
        // Assuming filters.address contains fields like city, state, etc.
        if (filters.address.city) {
          query.andWhere("address.city = :city", { city: filters.address.city });
        }
        if (filters.address.state) {
          query.andWhere("address.state = :state", { state: filters.address.state });
        }
        if (filters.address.country) {
            query.andWhere("address.country = :country", { state: filters.address.country });
        }
      }

      return await query.getManyAndCount();
    } catch (error) {
      console.error("Error retrieving restaurants:", error);
      throw error;
    }
  }

  // /**
  //  * Create and save a new restaurant along with its address.
  //  * @param restaurantData - Partial data for the restaurant.
  //  * @param addressData - Partial data for the address.
  //  * @returns The created restaurant entity.
  //  */
  // async create(
  //   restaurantData: Partial<Restaurant>,
  //   addressData?: Partial<Address>
  // ): Promise<Restaurant> {
  //   try {
  //     const restaurant = this.repository.create(restaurantData);

  //     if (addressData) {
  //       const addressRepository = AppDataSource.getRepository(Address);
  //       const address = addressRepository.create(addressData);
  //       restaurant.address = address;
  //     }

  //     return await this.repository.save(restaurant);
  //   } catch (error) {
  //     console.error("Error creating restaurant:", error);
  //     throw error;
  //   }
  // }

  /**
   * Create a new restaurant entity and optionally associate an address and a user.
   * @param restaurantData - Partial data for the restaurant.
   * @param addressData - Partial data for the address.
   * @param user - User entity or user ID to associate with the restaurant.
   * @returns The created but unsaved restaurant entity.
   */
  async create(
    restaurantData: Partial<Restaurant>,
    user?: User | string,
    addressData?: Partial<Address>,
  ): Promise<Restaurant> {
    const restaurant = this.repository.create(restaurantData);
      console.log("The data is: ", restaurantData, addressData, user);
    if (addressData) {
      const addressRepository = AppDataSource.getRepository(Address);
      const address = addressRepository.create(addressData);
      restaurant.address = address;
    }

    if (user) {
      if (typeof user === "string") {
        const userRepository = AppDataSource.getRepository(User);
        const userEntity = await userRepository.findOne({ where: { id: user } });
        if (!userEntity) {
          throw new Error("User not found");
        }
        restaurant.user = userEntity;
      } else {
        restaurant.user = user;
      }
    }

    return restaurant;
  }
  /**
   * Save a restaurant entity to the database.
   * @param restaurant - The restaurant entity to save.
   * @returns The saved restaurant entity.
   */
  async save(restaurant: Restaurant): Promise<Restaurant> {
    try {
      return await this.repository.save(restaurant);
    } catch (error) {
      console.error("Error saving restaurant:", error);
      throw error;
    }
  }


  /**
   * Update an existing restaurant's details.
   * @param id - The UUID of the restaurant to update.
   * @param updateData - Partial data to update the restaurant.
   * @param addressUpdateData - Partial data to update the address.
   * @returns The updated restaurant entity or undefined if not found.
   */
  async update(
    id: string,
    updateData: Partial<Restaurant>,
    addressUpdateData?: Partial<Address>
  ): Promise<Restaurant> {
    try {
      const restaurant = await this.findById(id);
      if (!restaurant) {
        throw new NotFoundError('Restaurant not found');;
      }

      // Update restaurant fields
      Object.assign(restaurant, updateData);

      const addressRepository = AppDataSource.getRepository(Address);

      // Update or create address if provided
      if (addressUpdateData) {
        if (restaurant.address) {
          // Update existing address
          Object.assign(restaurant.address, addressUpdateData);
        } else {
          // Create and assign new address
          const newAddress = addressRepository.create(addressUpdateData);
          restaurant.address = newAddress;
        }
      }

      return await this.repository.save(restaurant);
    } catch (error) {
      console.error("Error updating restaurant:", error);
      throw error;
    }
  }

  /**
   * Soft delete a restaurant by its ID.
   * @param id - The UUID of the restaurant to delete.
   * @returns A boolean indicating success.
   */
  async softDeleteById(id: string): Promise<boolean> {
    try {
      const restaurant = await this.findById(id);
      if(restaurant)
      {
        const result = await this.repository.softRemove(restaurant);
        return true;
      }
      else {
        throw new NotFoundError("Restaurant not found");
      }
    } catch (error) {
      console.error("Error soft deleting restaurant:", error);
      throw error;
    }
  }

  /**
   * Permanently delete a restaurant by its ID.
   * @param id - The UUID of the restaurant to delete.
   * @returns A boolean indicating success.
   */
  async _hardDeleteById(id: string): Promise<boolean> {
    try {
      const result = await this.repository.delete(id);
      return result.affected !== 0;
    } catch (error) {
      console.error("Error hard deleting restaurant:", error);
      throw error;
    }
  }

//   /**
//    * Assign a user to a restaurant.
//    * @param restaurantId - The UUID of the restaurant.
//    * @param userId - The UUID of the user.
//    * @returns The updated restaurant entity or undefined if not found.
//    */
//   async assignUser(restaurantId: string, userId: string): Promise<Restaurant | undefined> {
//     try {
//       const restaurant = await this.findById(restaurantId);
//       if (!restaurant) {
//         return undefined;
//       }

//       const userRepository = AppDataSource.getRepository(User);
//       const user = await userRepository.findOneBy({ id: userId });
//       if (!user) {
//         throw new Error("User not found");
//       }

//       restaurant.user = user;
//       return await this.repository.save(restaurant);
//     } catch (error) {
//       console.error("Error assigning user to restaurant:", error);
//       throw error;
//     }
//   }

//   /**
//    * Remove the assigned user from a restaurant.
//    * @param restaurantId - The UUID of the restaurant.
//    * @returns The updated restaurant entity or undefined if not found.
//    */
//   async unassignUser(restaurantId: string): Promise<Restaurant | undefined> {
//     try {
//       const restaurant = await this.findById(restaurantId);
//       if (!restaurant) {
//         return undefined;
//       }

//       restaurant.user = null;
//       return await this.repository.save(restaurant);
//     } catch (error) {
//       console.error("Error unassigning user from restaurant:", error);
//       throw error;
//     }
//   }

  /**
   * Search for restaurants by name or location with pagination.
   * @param query - The search keyword.
   * @param page - The page number for pagination.
   * @param size - The number of records per page.
   * @returns A tuple containing an array of restaurants and the total count.
   */
  async search(
    queryStr: string,
    page: number = 1,
    size: number = 10
  ): Promise<[Restaurant[], number]> {
    try {
      return await this.repository.findAndCount({
        where: [
          { name: Like(`%${queryStr}%`) },
          { address: { city: Like(`%${queryStr}%`) } },
          { address: { state: Like(`%${queryStr}%`) } },
          { address: { country: Like(`%${queryStr}%`) } },
          // Add more fields as needed
        ],
        relations: ["address", "user", "leads"],
        skip: (page - 1) * size,
        take: size,
      });
    } catch (error) {
      console.error("Error searching restaurants:", error);
      throw error;
    }
  }
}
