import { Request, Response } from "express";
import { menuItemService } from "./menuItem.service";


const getAllMenuItem = async(req: Request, res: Response)=>{

    try{

        const result = await menuItemService.getAllMenuItem();
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