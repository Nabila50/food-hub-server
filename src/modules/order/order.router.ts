import express, { Router } from 'express'
import app from '../../app';
import { orderController } from './order.controller';
import auth, { UserRole } from '../../middlewares/auth';

const router = express.Router();

router.post("/", auth(UserRole.ADMIN, UserRole.PROVIDER), orderController.createOrder)

router.get("/", orderController.getMyOrders)

router.get("/:orderId", orderController.getOrderById)

router.patch("/:orderId", auth(UserRole.ADMIN, UserRole.PROVIDER), orderController.updateOrderStatus)

export const orderRouter: Router = router;