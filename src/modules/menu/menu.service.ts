import { MenuWhereInput } from "../../../generated/prisma/models";
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

//* fatching all the menu

const getAllMenu = async({
  search,
  isAvailable,
  providerId
}:{
  // * implement serch options
  search: string | undefined,
  isAvailable: boolean | undefined,
  providerId: string | undefined
})=>{

  const andConditions : MenuWhereInput[] = []

  if(search){
    andConditions.push({
       OR: [
        {
          title: {
            contains: search as string,
            mode: "insensitive",
          }
        },
        {
          providerId :{
            contains: search as string,
            mode: "insensitive"
          }
        }

      ]
    })
  }

  if(typeof isAvailable === 'boolean'){
    andConditions.push({
      isAvailable
    })
  }

  if(providerId){
    andConditions.push({providerId})
  }


  const allMenu = await prisma.menu.findMany({
    where:{
      AND: andConditions
    }
  });

  
  
  return allMenu;
}

export const menuService = {
  createMenu,
  getAllMenu
};
