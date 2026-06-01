// fatching all the items

import { menuItemWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

const getAllMenuItem = async ({
   search,
   page, 
   limit,
   skip,
   sortBy,
   sortOrder
  }: { 
    search: string | undefined,
    page: number,
    limit: number,
    skip: number,
    sortBy: string ,
    sortOrder: string
  }) => {

    const andConditions : menuItemWhereInput[]=[]

    if(search){
      andConditions.push({
        OR: [
        {
          name: {
            contains: search as string,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search as string,
            mode: "insensitive",
          },
        },
        {
          price: {
            equals: Number(search),
          },
        },
      ]
      })
    }
    
  const allMenuItem = await prisma.menuItem.findMany({

    // take: limit,
    // skip,
    where: {
      AND: andConditions}
    // },
    // orderBy: sortBy
    // ? {
    //     [sortBy]: sortOrder || "asc",
    //   }
    // : {
    //     id: "desc",
    //   },
  });
  return allMenuItem;
};

// * delete MenuItem
const deleteMenuItem = async(menuItemId: string, providerId: string )=>{
  const menuItemData = await prisma.menuItem.findFirst({
    where:{
      id: menuItemId
      // providerId
    },
    select:{
      id: true
    }
  })
  
  if(!menuItemData){
    throw new Error("Your provided input is invalid!!!!")
  }

  return await prisma.menuItem.delete({
    where:{
      id: menuItemData.id
    }
  })
}

// * update Menu

export const menuItemService = {
  getAllMenuItem,
  deleteMenuItem
};
