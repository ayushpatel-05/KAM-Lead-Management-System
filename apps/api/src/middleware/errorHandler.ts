// import { logger } from '../support/logger.js' 
import { APIError } from "../utils/api-errors";
import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
/**
 * Error handling middleware for Express
 *
 * @param {Error} error - The error object
 * @param {Request} req - The Express request object
 * @param {Response} res - The Express response object
 * @param {Function} _next - The next middleware function
 */
const errorHandler = (error:any, req:Request, res:Response, _next:NextFunction) => {
    // logger.error(error)
    console.log("Error handler: ", error);
    // catch api error
    if (error instanceof APIError) {
      return res.status(error.status).json({
        error: {
          code: error.status,
          message: error.message
        }
      })
    }

    // Handle Zod validation errors
    if (error instanceof ZodError) {
      const firstIssue = error.issues[0]; // Get the first issue
      return res.status(422).json({
        error: {
          code: 422,
          message: "Validation error",
          details: {
            path: firstIssue.path.join("."),
            message: firstIssue.message,
          },
        },
      });
    }
  
    //Other error handling conditions, like typeorm error instance etc
  
    // connect all errors
    return res.status(500).json({
      error: {
        code: 500,
        message: 'Something went wrong!'
      }
    })
  }
  
  export default errorHandler