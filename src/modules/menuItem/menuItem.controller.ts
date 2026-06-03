import { Request, Response } from "express";
import { menuItemService } from "./menuItem.service";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";
import { UserRole } from "../../middlewares/auth";

const getAllMenuItem = async (req: Request, res: Response) => {
  try {
    // * Search options
    const { search } = req.query;
    const searchString = typeof search === "string" ? search : undefined;

    //* Pagination & Sortation

    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(
      req.query,
    );

    const result = await menuItemService.getAllMenuItem({
      search: searchString,
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
    });

    res.status(200).json(result);
  } catch (err) {
    res.status(401).json({
      error: "Failed to get all Menu Items!!!!",
      details: err,
    });
  }
};

// * Delete MenuItem
const deleteMenuItem = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { menuItemId } = req.params;

    const result = await menuItemService.deleteMenuItem(
      menuItemId as string,
      user?.id as string,
    );
    res.status(200).json(result);
  } catch (err) {
    res.status(404).json({
      error: "delete MenuItem failed!!!!",
      details: err,
    });
  }
};

// * update MenuItem
const updateMenuItem = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { menuItemId } = req.params;
    const isAdmin = user.role === UserRole.ADMIN
    const result = await menuItemService.updateMenuItem(
      menuItemId as string,
      req.body,
      user?.id as string,
      user?.role as string,
      isAdmin
    );
    res.status(200).json(result);
  } catch (e: any) {
    res.status(400).json({
      error: "Update is not possible!!!",
      details: e.message,
    });
  }
};

export const menuItemController = {
  getAllMenuItem,
  deleteMenuItem,
  updateMenuItem,
};
