import { Decimal } from "../../../../prisma/generated/prisma/runtime/library";
import Database from "../utils/Database";
import type { Request, Response, NextFunction } from "express";

async function getCostForThisMonth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const data = await Database.subscription.findMany({
      where: {
        nextBillingDate: {
          gte: startOfMonth,
          lt: startOfNextMonth,
        },
      },
      select: {
        price: true,
      },
    });

    let totalSpend = new Decimal(0);
    for (const subscription of data) {
      totalSpend = totalSpend.add(subscription.price);
    }

    res.status(200).json({
      totalSpend,
    });
    return;
  } catch (e) {
    next(e);
  }
}

async function topFiveSpenders(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const data = await Database.subscription.findMany({
      take: 5,
      orderBy: {
        price: "desc",
      },
    });

    res.status(200).json(data);
    return;
  } catch (e) {
    next(e);
  }
}

export default {
  getCostForThisMonth,
  topFiveSpenders,
};
