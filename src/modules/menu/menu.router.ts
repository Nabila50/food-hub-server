import express, {  Router } from "express";
import { menuController } from "./menu.controller";
 
import auth, { UserRole } from "../../middlewares/auth";

const router = express.Router();


router.get("/", menuController.getAllMenu)

router.post(
    "/",
    auth(UserRole.ADMIN, UserRole.PROVIDER),
    menuController.createMenu)


export const menuRouter: Router = router;