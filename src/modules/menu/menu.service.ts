import { Decimal } from "@prisma/client/runtime/client";
import { MenuWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { Prisma } from "../../../generated/prisma/client";


type MenuItemPayload = {
  name?: string | null;
  description: string;
  price: number | string;
  isFeatured?: boolean;
};

type CreateMenuPayload = {
  title: string;
  isAvailable?: boolean;
  image: string;
  providerId: string | undefined;
  menuItem: MenuItemPayload[];
};

type UpdateMenuPayload = {
  title?: string;
  image?: string;
  isAvailable?: boolean;

  menuItem?: {
    id: string;
    name?: string;
    image?: string;
    price?: number;
  }[];
};

const createMenu = async (
  data: CreateMenuPayload,
  providerId: string,
  role: string,
) => {
  const provider = await prisma.provider.findUnique({
    where: {
      userId: providerId,
    },
  });
 
  if (!provider) {
    throw new Error("Provider not found");
  }

  const result = await prisma.menu.create({
    data: {
      title: data.title,
      image: data.image,
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
    include: {
      menuItem: true,
    },
  });

  return allMenu;
};
//* Get single menu by Id
const getMenuById = async (id: string) => {
  const menuData = await prisma.menu.findUnique({
    where: {
      id,
    },
    include: {
      menuItem: true,
    },
  });

  if (!menuData) {
    throw new Error("Menu not found");
  }

  return menuData;
};

// * Delete Menu

const deleteMenu = async (menuId: string, providerId: string) => {
  const menu = await prisma.menu.findFirst({
    where: {
      id: menuId,
    },
  });

  if (!menu) {
    throw new Error("Menu not found")
  };

  if (menu.providerId !== providerId) {
    throw new Error("Unauthorized");
  }

  await prisma.menuItem.deleteMany({
    where: { menuId },
  });

  return prisma.menu.delete({
    where: { id: menuId },
  });
};

// * update Menu
 
const updateMenu = async (
  menuId: string,
  data: UpdateMenuPayload,
  userId: string,
 
) => {

  const provider = await prisma.provider.findUnique({
    where: {
      userId,
    
    },
  });
    
  if (!provider) {
    throw new Error("Provider not found");
  }

  const menu = await prisma.menu.findUnique({
    where: {
      id: menuId,
 
    },
    include: {
      menuItem: true,
    },
  });
  if (!menu) {
    throw new Error("Menu not found");
  }

  // Update Menu fields
 
  const updateData: any = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.image !== undefined) updateData.image = data.image;
  if (data.isAvailable !== undefined) updateData.isAvailable = data.isAvailable;

  await prisma.menu.update({
    where: { id: menuId },
    data: updateData,
  });

  // Update Menu Items
  if (data.menuItem?.length) {
    await Promise.all(
      data.menuItem.map((item) => {
        const itemUpdateData: any = {};
        if (item.name !== undefined) itemUpdateData.name = item.name;
        if (item.price !== undefined) itemUpdateData.price = Number(item.price);
        

           if (Object.keys(itemUpdateData).length === 0) {
        return;
      }

        return prisma.menuItem.update({
          where: {
            id: item.id,
          },
          data: itemUpdateData,
        });
      }),
    );
  }
 

  return prisma.menu.findUnique({
    where: {
      id: menuId,
    },
    include: {
      menuItem: true,
    },
  });
};

export const menuService = {
  createMenu,
  getAllMenu,
  deleteMenu,
  updateMenu,
  getMenuById,
};
