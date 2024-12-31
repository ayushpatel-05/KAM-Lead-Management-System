import { z } from "zod";

/**
 * Cleaned Address Schema
 */
export const AddressSchema = z.object({
    addressLine1: z.string().nullable().optional(),
    city: z.string().max(100).nullable().optional(),
    state: z.string().max(100).nullable().optional(),
    country: z.string().max(100).nullable().optional(),
    zipCode: z.string().max(20).nullable().optional(),
  });
//TODO: Put this is seperate file  


/**
 * Cleaned Restaurant Schema
 */  
export const RestaurantSchema = z.object({
name: z.string().min(1).max(255),
address: AddressSchema.optional(),
});

/**
 * Update Restaurant Schema
 */  
export const UpdateRestaurantSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  address: AddressSchema.optional(),
});


/**
 * Address Response Schema
 */
export const AddressResponseSchema = z.object({
  id: z.string().uuid().nullable().optional(),
  addressLine1: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  zipCode: z.string().nullable().optional(),
});


/**
 * Create Restaurant Response Schema
 */
export const RestaurantResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  address: AddressResponseSchema.nullable(), 
});

export type CreateRestaurantPayload = z.infer<typeof RestaurantSchema>;
export type RestaurantResponse = z.infer<typeof RestaurantResponseSchema>;
export type AddressResponse = z.infer<typeof AddressResponseSchema>;
export type updateRestaurantPayload = z.infer<typeof UpdateRestaurantSchema>;