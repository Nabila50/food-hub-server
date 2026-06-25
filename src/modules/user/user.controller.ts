import { Request, Response } from "express";
import { userService } from "./user.service";


export const getMyProfile = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    console.log("REQ.USER:", req.user);

    const user =
      await userService.getMyProfile(userId as string);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const userController = {
  getMyProfile,
 
};
