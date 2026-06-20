import { Provider } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { UserRole } from "../../middlewares/auth";


// * Create provider

const createProvider = async (data: {
  companyName: string;
  userId: string;
}) => {
  const user = await prisma.user.findUnique({
    where: {
      id: data.userId,
    },
  });

  //* If user is not found

  if (!user) {
    throw new Error("User is not found!!!!!");
  }

  //* if provider already exists
  const existingProvider = await prisma.provider.findUnique({
    where: {
      userId: data.userId,
    },
  });

  if (existingProvider) {
    throw new Error("user is already a provider....");
  }

  const result = await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: {
        id: data.userId,
      },
      data: {
        role: UserRole.PROVIDER,
      },
    });
    const provider = await tx.provider.create({
    data:{
        companyName: data.companyName,
        userId: data.userId
    }
  })
  return provider;
  });

  return result;

 
  
};

 // * get provider

const getProviderById = async(userId: string)=>{
  const result = await prisma.provider.findUnique({
    where:{
      userId
    },
    include:{
      user: true
    }
  })
  return result
}


export const providerService = {
  createProvider,
  getProviderById
};
