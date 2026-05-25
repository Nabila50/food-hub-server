import { prisma } from "../../lib/prisma";

type MenuItemPayload = {
  name?: string | null;
  description: string;
  price: number | string;
  isAvailable?: boolean;
  isFeatured?: boolean;
};

type CreateMenuPayload = {
  title: string;
  providerId: string;
  menuItem: MenuItemPayload[];
};

const createMenu = async (data: CreateMenuPayload, userId: string) => {
  const provider = await prisma.provider.findUnique({
    where: {
      userId: userId,
    },
  });

  if (!provider) {
    throw new Error("Provider not found");
  }

  const result = await prisma.menu.create({
    data: {
      title: data.title,
      providerId: provider.id,

      menuItem: {
        create: data.menuItem,
      },
    },
  });

  return result;
};

// fatching all the menu

const getAllMenu = async(payload:{search: string | undefined})=>{
  const allMenu = await prisma.menu.findMany({
    where:{
      OR: [
        {
          title: {
            contains: payload.search as string,
            mode: "insensitive",
          }
        },

      ]
    }
  });
  return allMenu;
}

export const menuService = {
  createMenu,
  getAllMenu
};
