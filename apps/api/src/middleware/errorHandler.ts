// import { logger } from '../support/logger.js' 
import { APIError } from '../utils/api-errors.js'
import { Request, Response, NextFunction } from "express";
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
  
    // catch api error
    if (error instanceof APIError) {
      return res.status(error.status).json({
        error: {
          code: error.status,
          message: error.message
        }
      })
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