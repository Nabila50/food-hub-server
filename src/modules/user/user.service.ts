 

import { prisma } from "../../lib/prisma";

export const getMyProfile = async (userId: string) => {
  return await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      provider: true,
    },
  });
};

export const getAllCustomers = async () => {
  return await prisma.user.findMany({
    where: {
      role: "CUSTOMER",
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};


export const userService = {
  getMyProfile,
 getAllCustomers
};