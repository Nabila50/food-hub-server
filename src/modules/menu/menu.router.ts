import express, {  Router } from "express";
import { menuController } from "./menu.controller";
 
import auth, { UserRole } from "../../middlewares/auth";

const router = express.Router();


router.get("/", menuController.getAllMenu)

router.post(
    "/",
    auth(UserRole.ADMIN, UserRole.PROVIDER),
    menuController.createMenu)

router.delete("/:menuId", auth(UserRole.ADMIN, UserRole.PROVIDER), menuController.deleteMenu)

export const menuRouter: Router = router;