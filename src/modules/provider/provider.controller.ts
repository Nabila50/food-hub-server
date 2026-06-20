import { Request, Response } from "express";
import { providerService } from "./provider.service";

// * create provider
const createProvider = async (req: Request, res: Response) => {
  try {
    const result = await providerService.createProvider(req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({
      error: "Provider cannot be created!!!!!!",
      details: err,
    });
  }
};
// * Get provider by Id

const getProviderById = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    const provider = await providerService.getProviderById(userId as string);
    console.log("Provider: ", provider)

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: "Provider not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: provider,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const providerController = {
  createProvider,
  getProviderById
};
