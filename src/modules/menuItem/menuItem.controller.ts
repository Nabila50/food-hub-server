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

// * Delete MenuItem
const deleteMenuItem = async (req: Request, res: Response)=>{
  try{
    const user = req.user;
    const {menuitemsId} = req.params ;
    const result = await menuItemService.deleteMenuItem(menuitemsId as string, user?.id as string);
    res.status(200).json({
      success: true,
      message: "Menu item deleted successfully",
      data: result,
    });

  }catch(err){
    res.status(404).json({
      error: "delete MenuItem failed!!!!",
      details: err
    })
  }
}

export const menuItemController = {
  getAllMenuItem,
  deleteMenuItem
};
