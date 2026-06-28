import express, { Router } from "express";
import { userController } from "./user.controller";
import auth, { UserRole } from "../../middlewares/auth";
// import authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.PROVIDER),
  userController.getAllCustomers
);

router.get(
  "/profile",
  auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.PROVIDER),
  userController.getMyProfile
);

 


export const userRouter: Router= router;