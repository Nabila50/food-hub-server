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

    take: limit,
    skip,
    where: {
      AND: andConditions
    },
    orderBy: {
      [sortBy]: sortOrder
    }
  });
  return allMenuItem;
};

export const menuItemService = {
  getAllMenuItem,
};
