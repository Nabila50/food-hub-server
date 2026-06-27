// fatching all the items

import { string } from "better-auth";
import { menuItemWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { Decimal } from "@prisma/client/runtime/client";
import { OrderStatus } from "../../../generated/prisma/client";

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
    include: {
    reviews: true, 
  },
   
  });
  return allMenuItem;
};

// * delete MenuItem
const deleteMenuItem = async (
  menuItemId: string,
  providerId: string,
  isAdmin: boolean,
) => {
  const menuItemData = await prisma.menuItem.findUnique({
    where: {
      id: menuItemId,
    },
    select: {
      id: true,
      providerId: true,
    },
  });

  if (!menuItemData) {
    throw new Error("MenuItem not found!");
  }

  if (!isAdmin) {
    if (menuItemData.providerId !== providerId) {
      throw new Error("You are not authorized to delete this menu item");
    }
  }

  return await prisma.menuItem.delete({
    where: {
      id: menuItemId,
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
) => {
  if (role === "ADMIN") {
    return await prisma.menuItem.update({
      where: {
        id: menuItemId,
      },
      data,
    });
  }

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
    throw new Error("You are not allowed to update this");
  }
};

// * stats

const getStatus = async () => {
  return await prisma.$transaction(async (tx) => {
    const [totalMenuItem, pendingMenuItem, onWayMenuIte, totalMenu, cancleMenuItem, totalUser, adminCount, providerCount, customerCount, ] = await Promise.all([
      await tx.menuItem.count(),
      await tx.order.count({ where: { status: OrderStatus.PENDING } }),
      await tx.order.count({ where: { status: OrderStatus.ONWAY } }),
      await tx.order.count({ where: {status: OrderStatus.CANCELLED} }),
      await tx.menu.count(),
      await tx.user.count(),
      await tx.user.count({where: {role:"ADMIN"}}),
      await tx.user.count({where: {role:"PROVIDER"}}),
      await tx.user.count({where: { role: "CUSTOMER"}})
    ]);

    return {
      totalMenuItem,
      pendingMenuItem,
      onWayMenuIte,
      totalMenu,
      cancleMenuItem,
      totalUser,
      adminCount,
      providerCount,
      customerCount

    };
  });
};

export const menuItemService = {
  getAllMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getStatus,
};
