import { z } from "zod";

/**
 * Cleaned user Schema
 */
export const UserSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string().nullable(), // Assuming the phone number is always 10 digits
  email: z.string().email(),
  role: z.string(),
});

const DataSchema = z.object({
  user: UserSchema,
});

/**
 * Login Schema
 */
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

/**
 * Register Schema
 */
export const registerSchema = z.object({
    firstName: z.string().min(2, "First Name is required"),
    lastName: z.string().min(2, "Last Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    role: z.enum(["kam", "sales"]),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters long"),
  }).refine(
    (values) => {
        return values.password === values.confirmPassword;
      },
      {
        message: "Passwords must match!",
        path: ["confirmPassword"],
      }
  );

/**
 * Backend Register Schema
 */
export const backendRegisterSchema = registerSchema.innerType().omit({confirmPassword: true});

/**
 * Login Response Schema
 */
export const loginResponseSchema = z.object({
  message: z.string(),
  data: DataSchema,
});


/**
 * Signup Response Schema(Same as login schema for now)
 */
export const registerResponseSchema = z.object({
  message: z.string(),
  data: DataSchema,
});



/**
 * Types for inferred schema outputs
 */
export type LoginPayload = z.infer<typeof loginSchema>;
export type RegisterPayload = z.infer<typeof registerSchema>;
export type BackendRegisterPayload = z.infer<typeof backendRegisterSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type RegisterResponse = z.infer<typeof registerResponseSchema>;
export type User = z.infer<typeof UserSchema>;