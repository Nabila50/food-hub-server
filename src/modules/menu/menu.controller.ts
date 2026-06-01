import { Request, Response } from "express";
import { menuService } from "./menu.service";
import { boolean, success } from "better-auth";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";

const createMenu = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({
        error: "Menu Cration Failed",
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

// * Delete Menu

const deleteMenu = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { menuId } = req.params;

    const result = await menuService.deleteMenu(
      menuId as string,
      user?.id as string,
    );
    
    res.status(200).json({
      success: "deleted successfully!!!",
      details: result,
    });
  } catch (e) {
    res.status(404).json({
      error: "delete Menu failed",
      details: e,
    });
  }
};

export const menuController = {
  createMenu,
  getAllMenu,
  deleteMenu,
};
