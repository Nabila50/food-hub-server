
// fatching all the items

import { prisma } from "../../lib/prisma";

const getAllMenuItem = async()=>{
    const allMenuItem = await prisma.menuItem.findMany();
    return allMenuItem;
}



export const menuItemService = {
  getAllMenuItem
};