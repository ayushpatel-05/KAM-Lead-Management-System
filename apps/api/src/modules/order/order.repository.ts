import { AppDataSource, Order, Lead, User, Interaction } from "@repo/db";
import { Repository } from "typeorm";
import { GetAllOrderPayload } from "@repo/schemas";

export class OrderRepository {
  private repository: Repository<Order>;

  constructor() {
    this.repository = AppDataSource.getRepository(Order);
  }

  /**
   * Find an order by its unique ID
   * @param id - The UUID of the order.
   * @returns The order entity or null if not found.
   */
  async findById(id: string): Promise<Order | null> {
    try {
      return await this.repository.findOne({
        where: { id },
        relations: ["lead", "user", "interaction"],
      });
    } catch (error) {
      console.error("Error finding order by ID:", error);
      throw error;
    }
  }

  /**
   * Retrieve a paginated list of orders with optional filters.
   * @param filters - Partial filters based on Order fields.
   * @param page - The page number for pagination.
   * @param size - The number of records per page.
   * @returns A tuple containing an array of orders and the total count.
   */
  async findAll(
    filters: GetAllOrderPayload,
    page: number = 1,
    size: number = 10
  ): Promise<[Order[], number]> {
    try {
      const query = this.repository.createQueryBuilder("order")
        .leftJoinAndSelect("order.lead", "lead")
        .leftJoinAndSelect("order.user", "user")
        .leftJoinAndSelect("order.interaction", "interaction")
        .where("order.deletedAt IS NULL")
        .skip((page - 1) * size)
        .take(size);

      if (filters.totalAmount) {
        query.andWhere("order.totalAmount = :totalAmount", {
          totalAmount: filters.totalAmount,
        });
      }

      if (filters.orderDate) {
        query.andWhere("order.orderDate = :orderDate", {
          orderDate: filters.orderDate,
        });
      }

      if (filters.leadId) {
        query.andWhere("order.lead.id = :leadId", { leadId: filters.leadId });
      }

      if (filters.userId) {
        query.andWhere("order.user.id = :userId", { userId: filters.userId });
      }

      if (filters.notes) {
        query.andWhere("order.notes LIKE :notes", { notes: `%${filters.notes}%` });
      }

      return await query.getManyAndCount();
    } catch (error) {
      console.error("Error retrieving orders:", error);
      throw error;
    }
  }

  /**
   * Create a new order entity.
   * @param orderData - Partial data for the order.
   * @param leadId - The lead ID associated with the order.
   * @param userId - The user ID who placed the order.
   * @param interactionId - The interaction ID related to the order (optional).
   * @returns The created but unsaved order entity.
   */
  async create(
    orderData: Partial<Order>,
    leadId: string,
    userId: string,
    interactionId?: string
  ): Promise<Order> {
    const order = this.repository.create(orderData);

    const lead = await AppDataSource.getRepository(Lead).findOne({ where: { id: leadId } });
    if (!lead) throw new Error("Lead not found");
    order.lead = lead;

    const user = await AppDataSource.getRepository(User).findOne({ where: { id: userId } });
    if (!user) throw new Error("User not found");
    order.user = user;

    if (interactionId) {
      const interaction = await AppDataSource.getRepository(Interaction).findOne({ where: { id: interactionId } });
      if (!interaction) throw new Error("Interaction not found");
      order.interaction = interaction;
    }

    return order;
  }

  /**
   * Save an order entity to the database.
   * @param order - The order entity to save.
   * @returns The saved order entity.
   */
  async save(order: Order): Promise<Order> {
    try {
      return await this.repository.save(order);
    } catch (error) {
      console.error("Error saving order:", error);
      throw error;
    }
  }

  /**
   * Update an existing order's details.
   * @param id - The UUID of the order to update.
   * @param updateData - Partial data to update the order.
   * @returns The updated order entity or undefined if not found.
   */
  async update(id: string, updateData: Partial<Order>): Promise<Order> {
    try {
      const order = await this.repository.findOne({ where: { id } });
      if (!order) {
        throw new Error("Order not found");
      }

      Object.assign(order, updateData);

      return await this.repository.save(order);
    } catch (error) {
      console.error("Error updating order:", error);
      throw error;
    }
  }

  /**
   * Soft delete an order by its ID.
   * @param id - The UUID of the order to delete.
   * @returns A boolean indicating success.
   */
  async softDeleteById(id: string): Promise<boolean> {
    try {
      const order = await this.repository.findOne({ where: { id } });
      if (order) {
        await this.repository.softRemove(order);
        return true;
      } else {
        throw new Error("Order not found");
      }
    } catch (error) {
      console.error("Error soft deleting order:", error);
      throw error;
    }
  }

  /**
   * Permanently delete an order by its ID.
   * @param id - The UUID of the order to delete.
   * @returns A boolean indicating success.
   */
  async hardDeleteById(id: string): Promise<boolean> {
    try {
      const result = await this.repository.delete(id);
      return result.affected !== 0;
    } catch (error) {
      console.error("Error hard deleting order:", error);
      throw error;
    }
  }
}
