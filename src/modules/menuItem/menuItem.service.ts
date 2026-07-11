// fatching all the items

import { string } from "better-auth";
import { menuItemWhereInput } from "../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { Decimal } from "@prisma/client/runtime/client";
import { OrderStatus } from "../../generated/prisma/client";
import { text } from "node:stream/consumers";
import { stripe } from "../../config/stripe.config";
import { envVars } from "../../config/env";

type menuItemPayload = {
  id: string;
  name?: string;
  image?: string;
  price?: number;
};

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
  // * -----------------payment method---------------

  // const result = await prisma.$transaction(async (tx) => {
  //   const menuItemData = await tx.menuItem.create({
  //     data: {
  //       menuItemId: menuItemPayload.id,
  //       name: menuItemPayload.name,
  //       image: menuItemPayload.image,
  //       price: menuItemPayload.price

  //     },
  //     data:{
  //       isAvailable: true
  //     }
  //   });
  // });
  // // transaction Id
  // const transctionId = String;

  // const paymentData = await tx.payment.create({
  //   data: {
  //     menuItemId: menuItemData.id,
  //     amount: menuItemData.price,
  //     transctionId,
  //   },
  // });

  // const session = await stripe.checkout.sessions.create({
  //   payment_method_types: [`card`],
  //   line_items: [
  //     {
  //       price_data: {
  //         currency: "bdt",
  //         product_data: {
  //           name: `Name of menuItem is ${menuItem.name}`,
  //         },
  //         unit_amount: getAllMenuItem.price * 120,
  //       },
  //       quantity: 1,
  //     },
  //   ],
  //   metadata: {
  //     menuItemId: menuItem.id,
  //     paymentId: paymentData.id,
  //   },
  //   success_url: `${envVars.FRONTEND_URL}/dashboard/payment/payment-success`,

  //   cancel_url: `${envVars.FRONTEND_URL}/dashboard/payment/payment-failed`,
  // });

  // return {
  //   menuItemData,
  //   paymentData,
  //   paymentUrl : session.url,
  // };

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
    const [
      totalMenuItem,
      pendingMenuItem,
      onWayMenuIte,
      totalMenu,
      cancleMenuItem,
      totalUser,
      adminCount,
      providerCount,
      customerCount,
      payment,
    ] = await Promise.all([
      await tx.menuItem.count(),
      await tx.order.count({ where: { status: OrderStatus.PENDING } }),
      await tx.order.count({ where: { status: OrderStatus.ONWAY } }),
      await tx.order.count({ where: { status: OrderStatus.CANCELLED } }),
      await tx.menu.count(),
      await tx.user.count(),
      await tx.user.count({ where: { role: "ADMIN" } }),
      await tx.user.count({ where: { role: "PROVIDER" } }),
      await tx.user.count({ where: { role: "CUSTOMER" } }),
      await tx.payment.count(),
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
      customerCount,
    };
  });
};

export const menuItemService = {
  getAllMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getStatus,
};
