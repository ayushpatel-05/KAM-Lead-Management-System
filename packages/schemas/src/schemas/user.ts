import { z } from "zod";

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
 * Types for inferred schema outputs
 */
export type Login = z.infer<typeof loginSchema>;
export type Register = z.infer<typeof registerSchema>;
export type BackendRegister = z.infer<typeof backendRegisterSchema>;