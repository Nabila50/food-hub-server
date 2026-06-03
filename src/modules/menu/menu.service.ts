import { Decimal } from "@prisma/client/runtime/client";
import { MenuWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { Prisma } from "../../../generated/prisma/client";
// import { string } from "better-auth";

type MenuItemPayload = {
  name?: string | null;
  description: string;
  price: number | string;
  // isAvailable?: boolean;
  isFeatured?: boolean;
};

type CreateMenuPayload = {
  title: string;
  isAvailable?: boolean;
  providerId: string | undefined;
  menuItem: MenuItemPayload[];
};

type UpdateMenuPayload = {
  title?: string;
  menuItem?: {
    id: string;
    name?: string;
    image?: string;
    price?: Decimal;
    isFeatured?: boolean;
  }[];
};

const createMenu = async (data: CreateMenuPayload, providerId: string) => {
  const provider = await prisma.provider.findUnique({
    where: {
      userId: providerId,
    },
  });
  console.log("Logged in user:", providerId);
  console.log("provider: ", provider);
  if (!provider) {
    throw new Error("Provider not found");
  }

  const result = await prisma.menu.create({
    data: {
      title: data.title,
      providerId: provider.id,

      menuItem: {
        create: data.menuItem.map((item) => ({
          name: item.name as string,
          description: item.description,
          price: Number(item.price),
          isFeatured: item.isFeatured ?? false,
          providerId: provider.id,
        })),
      },
    },
    include: {
      menuItem: true,
    },
  });

  return result;
};

//* fatching all the menu

const getAllMenu = async ({
  search,
  isAvailable,
  providerId,
  page,
  limit,
  skip,
  sortBy,
  sortOrder,
}: {
  // * implement serch options
  search: string | undefined;
  isAvailable: boolean | undefined;
  providerId: string | undefined;
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
}) => {
  const andConditions: MenuWhereInput[] = [];

  if (search) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: search as string,
            mode: "insensitive",
          },
        },
        {
          providerId: {
            contains: search as string,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  if (typeof isAvailable === "boolean") {
    andConditions.push({
      isAvailable,
    });
  }

  if (providerId) {
    andConditions.push({ providerId });
  }

  const allMenu = await prisma.menu.findMany({
    where: {
      AND: andConditions,
    },
  });

  return allMenu;
};

// * Delete Menu

const deleteMenu = async (menuId: string, providerId: string) => {
  const menuData = await prisma.menu.delete({
    where: {
      id: menuId,
      providerId,
    },
    select: {
      id: true,
    },
  });

  if (!menuData) {
    throw new Error("Your provided input is invalid!!!");
  }

  return await prisma.menuItem.delete({
    where: {
      id: menuId,
    },
  });
};

// * update Menu
const updateMenu = async (
  menuId: string,
  data: {
    title?: string;
    isAvailable?: boolean;
  },
  userId: string
) => {

  const provider = await prisma.provider.findUnique({
    where: {
      userId,
    },
  });

  if (!provider) {
    throw new Error("Provider not found");
  }

  const menu = await prisma.menu.findFirst({
    where: {
      id: menuId,
      providerId: provider.id,
    },
  });

  if (!menu) {
    throw new Error("Menu not found");
  }

  return prisma.menu.update({
    where: {
      id: menuId,
    },
    data,
  });
};

export const menuService = {
  createMenu,
  getAllMenu,
  deleteMenu,
  updateMenu,
};
