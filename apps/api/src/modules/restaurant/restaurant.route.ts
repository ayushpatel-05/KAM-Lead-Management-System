import { Router } from "express";
import { RestaurantController } from "./restaurant.controller";
import { asyncErrorHandler } from "../../middleware/asyncErrorHandler";
import isAuthenticatedUser from "../../middleware/authMiddleware";

const router = Router();
const restaurantController = new RestaurantController();

router.get("/restaurants", isAuthenticatedUser, (req, res, next) => asyncErrorHandler(restaurantController.getAllRestaurants(req, res, next)));
router.get("/restaurants/user", isAuthenticatedUser, (req, res, next) => asyncErrorHandler(restaurantController.getRestaurantsByUser(req, res, next)));
router.get("/restaurants/:id", isAuthenticatedUser, (req, res, next) => asyncErrorHandler(restaurantController.getRestaurantById(req, res, next)));
router.post("/restaurants",isAuthenticatedUser, (req, res, next) => asyncErrorHandler(restaurantController.createRestaurant(req, res, next)));
router.patch("/restaurants/:id",isAuthenticatedUser, (req, res, next) => asyncErrorHandler(restaurantController.updateRestaurant(req, res, next)));
router.delete("/restaurants/:id",isAuthenticatedUser, (req, res, next) => asyncErrorHandler(restaurantController.deleteRestaurant(req, res, next)));
//TODO: Search functionality will be implemented at last
// router.get("/restaurants/search", isAuthenticatedUser, (req, res, next) => asyncErrorHandler(authController.getUser(req,res,next)))
//Bulk upload api
//Statisctics API
//Get lead conversion rate
//Get overall restaurant stats
export default router;