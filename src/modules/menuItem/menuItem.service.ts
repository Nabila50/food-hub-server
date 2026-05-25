// fatching all the items

import { prisma } from "../../lib/prisma";

const getAllMenuItem = async ({
   search 
  }: { 
    search: string | undefined 
  }) => {
    
  const allMenuItem = await prisma.menuItem.findMany({
    where: {
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
      ],
    },
  });
  return allMenuItem;
};

export const menuItemService = {
  getAllMenuItem,
};
