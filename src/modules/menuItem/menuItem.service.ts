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
const deleteMenuItem = async(menuitemsId: string, providerId: string) =>{
    // FIND PROVIDER USING USER ID
  // const provider = await prisma.provider.findUnique({
  //   where: {
  //     userId: providerId,
  //   },
  // });

  // if (!provider) {
  //   throw new Error("Provider not found");
  // }
  const MenuItemData = await prisma.menuItem.findFirst({
    where:{
      id: menuitemsId,
       providerId
    },
    // select:{
    //   id: true
    // }
  })
  console.log(MenuItemData)
  // if(!MenuItemData){
  //   throw new Error("your provided input is invalid")
  // }

  // return await prisma.menuItem.delete({
  //   where:{
  //     id: MenuItemData.id
  //   }
  // })

 
}


export const menuItemService = {
  getAllMenuItem,
  deleteMenuItem
};
