// fatching all the items

import { prisma } from "../../lib/prisma";

const getAllMenuItem = async (payload: { search: string | undefined }) => {
  const allMenuItem = await prisma.menuItem.findMany({
    where: {
      OR: [
        {
          name: {
            contains: payload.search as string,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: payload.search as string,
            mode: "insensitive",
          },
        },
        {
          price: {
            equals: Number(payload.search),
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
