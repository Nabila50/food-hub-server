import { Request, Response } from "express";
import { menuService } from "./menu.service";

const createMenu = async (req: Request, res: Response) => {
  try {
    const user = req.user
    if (!user) {
      return res.status(400).json({
        error: "Menu Cration Failed"
      });
    }
    const result = await menuService.createMenu(req.body, user.id as string);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({
      error: "Menu Cration Failed",
      details: err,
    });
  }
};
export const menuController = {
  createMenu,
};
