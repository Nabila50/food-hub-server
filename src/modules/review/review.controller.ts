import { Request, Response } from "express";
import { reviewService } from "./review.service";

const createReview = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req.user as any).id;

    const result =
      await reviewService.createReview(
        userId,
        req.body
      );

    return res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const reviewController = {
    createReview
}