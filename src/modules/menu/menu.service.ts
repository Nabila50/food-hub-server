 
import { prisma } from "../../lib/prisma";
 

type MenuItemPayload = {
  name?: string | null
  description: string
  price: number | string
  isAvailable?: boolean
  isFeatured?: boolean
}

type CreateMenuPayload = {
  title: string
  providerId: string
  menuItem: MenuItemPayload[]
}

const createMenu =  async(data: CreateMenuPayload) =>{

    const result = await prisma.menu.create({
        data: {
          title: data.title,
          providerId: data.providerId,
          menuItem: {
            create: data.menuItem
          }
        }
    })

    return result;
 
}

export const menuService = {
    createMenu
}