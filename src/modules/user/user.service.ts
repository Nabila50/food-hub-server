 

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


export const userService = {
  getMyProfile,
 
};