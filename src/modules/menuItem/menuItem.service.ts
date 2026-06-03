// fatching all the items

import { string } from "better-auth";
import { menuItemWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { Decimal } from "@prisma/client/runtime/client";

const getAllMenuItem = async ({
  search,
  page,
  limit,
  skip,
  sortBy,
  sortOrder,
}: {
  search: string | undefined;
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
}) => {
  const andConditions: menuItemWhereInput[] = [];

  if (search) {
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
      ],
    });
  }

  const allMenuItem = await prisma.menuItem.findMany({
    // take: limit,
    // skip,
    where: {
      AND: andConditions,
    },
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
const deleteMenuItem = async (menuItemId: string, providerId: string) => {
  const menuItemData = await prisma.menuItem.findFirst({
    where: {
      id: menuItemId,
      // providerId
    },
    select: {
      id: true,
    },
  });

  if (!menuItemData) {
    throw new Error("Your provided input is invalid!!!!");
  }

  return await prisma.menuItem.delete({
    where: {
      id: menuItemData.id,
    },
  });
};

// * update MenuItem
const updateMenuItem = async (
  menuItemId: string,
  data: {
    name?: string;
    description?: string;
    price?: Decimal;
    isAvailable?: boolean;
    isFeatured?: boolean;
    image?: string;
  },
  userId: string,
  role: string,
  isAdmin: boolean
) => {

  if (role === "ADMIN") {
    return await prisma.menuItem.update({
      where: {
        id: menuItemId,
      },
      data,
    });
  };

  const provider = await prisma.provider.findUnique({
    where: {
      userId,
    },
  });
  console.log("Provider:", provider);

  if (!provider) {
    throw new Error("Provider not found");
  }

  const menuItem = await prisma.menuItem.findFirst({
    where: {
      id: menuItemId,
      providerId: provider.id,
    },
  });

  if (!menuItem) {
    throw new Error("menuItem is not found");
  }

  
};

export const menuItemService = {
  getAllMenuItem,
  deleteMenuItem,
  updateMenuItem,
};
