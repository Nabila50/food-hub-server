import { Prisma } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createReview = async (
  userId: string,
  data: {
    menuItemId: string;
    rating: number;
    comment?: string;
  }
) => {

  return await prisma.review.create({
    data: {
      userId,
      menuItemId: data.menuItemId,
      rating: new Prisma.Decimal(data.rating),
      comment: data.comment ?? null,
    },
  });
};

export const reviewService = {
  createReview,
};