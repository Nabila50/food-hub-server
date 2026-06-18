import express, {  Router } from "express";
import { menuController } from "./menu.controller";
 
import auth, { UserRole } from "../../middlewares/auth";

const router = express.Router();


router.get("/", menuController.getAllMenu);
router.get("/:menuId", menuController.getMenuById);

router.post(
    "/",
    auth(UserRole.ADMIN, UserRole.PROVIDER),
    menuController.createMenu)

router.delete("/:menuId", auth(UserRole.ADMIN, UserRole.PROVIDER), menuController.deleteMenu)

router.patch("/:menuId", auth(UserRole.ADMIN, UserRole.PROVIDER), menuController.updateMenu)

export const menuRouter: Router = router;