import { Provider } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";


const createProvider = async(data: Omit<Provider, "id">)=>{

    const result = await prisma.provider.create({
        data
    })

    return result;
}

export const providerService = {
    createProvider
}