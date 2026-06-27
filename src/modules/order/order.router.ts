import express, { Router } from 'express'
import app from '../../app';
import { orderController } from './order.controller';
import auth, { UserRole } from '../../middlewares/auth';

const router = express.Router();

router.post("/", auth(UserRole.ADMIN, UserRole.PROVIDER, UserRole.CUSTOMER), orderController.createOrder)

router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.PROVIDER, UserRole.CUSTOMER),
  orderController.getMyOrders
)

router.get("/:orderId", orderController.getOrderById)

router.patch(
  "/:orderId",
  auth(
    UserRole.ADMIN,
    UserRole.PROVIDER,
    UserRole.CUSTOMER
  ),
  orderController.updateOrderStatus
);
export const orderRouter: Router = router;