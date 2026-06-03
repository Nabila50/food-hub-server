import { boolean, includes, promise } from "better-auth";
import { prisma } from "../../lib/prisma";
import { OrderStatus } from "../../../generated/prisma/client";

export type TOrderItem = {
  menuItemId: string;
  quantity: number;
};

export type TCreateOrder = {
  customerId: string;
  items: TOrderItem[];
};

const createOrder = async (customerId: string, items: TOrderItem[]) => {
  const menuItems = await prisma.menuItem.findMany({
    where: {
      id: {
        in: items.map((item) => item.menuItemId),
      },
    },
  });

  if (!menuItems.length) {
    throw new Error("Menu items not found");
  }

  let totalPrice = 0;

  const orderItemsData = items.map((item) => {
    const menu = menuItems.find((menu) => menu.id === item.menuItemId);

    if (!menu) {
      throw new Error(`Menu item not found`);
    }

    totalPrice += Number(menu.price) * item.quantity;

    return {
      menuItemId: menu.id,
      quantity: item.quantity,
      price: menu.price,
    };
  });

  const result = await prisma.order.create({
    data: {
      customerId,
      totalPrice: totalPrice.toString(),

      orderItems: {
        create: orderItemsData,
      },
    },

    include: {
      orderItems: {
        include: {
          menuItem: true,
        },
      },
    },
  });

  return result;
};

// * get all orders
const getMyOrders = async (customerId: string) => {
  return prisma.order.findMany({
    where: {
      customerId,
    },
    include: {
      orderItems: {
        include: {
          menuItem: true,
        },
      },
    },
  });
};

// * get order by Id

const getOrderById = async (id: string) => {
  return prisma.order.findUnique({
    where: { id },
    include: {
      orderItems: {
        include: {
          menuItem: true,
        },
      },
    },
  });
};

// * update order Status
const updateOrderStatus = async (id: string, data: { status: OrderStatus }) => {
  const orderData= await prisma.order.findUnique({
    where: {
      id,
    },
    select:{
      id: true,
      status: true
    }
  });

  if(!orderData){
    throw new Error ("Order Status update is failed!!!")
  }

  if(orderData.status === data.status){
    throw new Error (`Your provided ${data.status} has already been updated!!`)
  }

  return await prisma.order.update({
    where: {
      id,
    },
    data
  });
};

export const orderService = {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
};
