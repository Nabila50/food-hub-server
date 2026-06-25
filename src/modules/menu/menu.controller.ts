import { Request, Response } from "express";
import { menuService } from "./menu.service";
import { boolean, success } from "better-auth";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";
import { role } from "better-auth/client";
import { providerController } from "../provider/provider.controller";
import { prisma } from "../../lib/prisma";

// * Create Menu
const createMenu = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({
        error: "Menu Cration Failed lack of user",
      });
    }
    const result = await menuService.createMenu(
      req.body,
      user.id as string,
      user.role,
    );
    res.status(200).json(result);
  } catch (err: any) {
    res.status(400).json({
      error: "Menu Cration Failed because of menu Service",
      details: err.message,
    });
  }
};

//* fatching all the menu

const getAllMenu = async (req: Request, res: Response) => {
  try {
    //* searching menu through name

    const { search } = req.query;
    const searchString = typeof search === "string" ? search : undefined;

    //^ searching menu through isAvailable
    const isAvailable = req.query.isAvailable
      ? req.query.isAvailable === "true"
        ? true
        : req.query.isAvailable === "false"
          ? false
          : undefined
      : undefined;

    // * pagination
    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(
      req.query,
    );
    // !searching providerId

    const providerId = req.query.providerId as string | undefined;

    const result = await menuService.getAllMenu({
      search: searchString,
      isAvailable,
      providerId,
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
    });
    res.status(200).json(result);
  } catch (err: any) {
    console.log(err);

    res.status(400).json({
      error: "Menu Creation Failed",
      details: err.message,
      stack: err.stack,
    });
  }
};

// * Get Single Menu By Id
const getMenuById = async (req: Request, res: Response) => {
  try {
    const { menuId } = req.params;

    const result = await menuService.getMenuById(menuId as string);

    if (!result) {
      return res.status(404).json({
        error: "Menu not found",
      });
    }

    res.status(200).json(result);
  } catch (err: any) {
    res.status(400).json({
      error: "Failed to fetch menu",
      details: err.message,
    });
  }
};

// * Delete Menu

const deleteMenu = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { menuId } = req.params;

    const provider = await prisma.provider.findUnique({
      where: {
        userId: req.user?.id as string,
      },
    });

    if (!provider) {
      return res.status(400).json({
        error: "Provider not found",
      });
    }
    console.log("USER:", req.user);

    const result = await menuService.deleteMenu(
      menuId as string,
      provider.id, 
    );
  } catch (e: any) {
    console.error("DELETE FAILED:", e.message);

    return res.status(400).json({
      success: false,
      error: e.message,
    });
  }
};

// * Update Menu
const updateMenu = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    console.log(user);
    const { menuId } = req.params;
    const result = await menuService.updateMenu(
      menuId as string,
      req.body,
      user?.id as string,
    );
    res.status(200).json(result);
  } catch (e: any) {
    res.status(400).json({
      error: "Update is not possible!",
      details: e.message,
    });
  }
};

export const menuController = {
  createMenu,
  getAllMenu,
  deleteMenu,
  updateMenu,
  getMenuById,
};
