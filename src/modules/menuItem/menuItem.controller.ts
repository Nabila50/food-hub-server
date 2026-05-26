import { Request, Response } from "express";
import { menuItemService } from "./menuItem.service";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";
 

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

export const menuItemController = {
  getAllMenuItem,
};
