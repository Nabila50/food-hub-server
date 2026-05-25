import { Request, Response } from "express";
import { menuItemService } from "./menuItem.service";


const getAllMenuItem = async(req: Request, res: Response)=>{

    try{
        const {search} = req.query
        const searchString = typeof search === 'string' ? search:undefined

        const result = await menuItemService.getAllMenuItem({search: searchString ?? ""});
        res.status(200).json(result) 

    }catch(err){
        res.status(401).json({
            error: "Failed to get all Menu Items!!!!",
            details: err
        })
    }
}

export const menuItemController ={
    getAllMenuItem
}