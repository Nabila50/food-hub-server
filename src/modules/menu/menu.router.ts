import express, { Request, Response, Router } from "express";
import { menuController } from "./menu.controller";

const router = express.Router();

router.post("/menu", menuController.createMenu)


export const menuRouter: Router = router;