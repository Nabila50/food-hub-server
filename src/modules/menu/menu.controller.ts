import { Request, Response } from "express";
import { menuService } from "./menu.service";

const createMenu = async (req:Request, res:Response) =>{
    try{
        const result = await menuService.createMenu(req.body)
        res.status(200).json(result)
    }catch(err){
        res.status(400).json({
            error: "Menu Cration Failed",
            details: err
        })
    }
}
export const menuController = {
    createMenu
}