import Database from "../utils/Database";
import { subscriptions } from "../utils/Schemas";
import type { Request, Response, NextFunction } from "express";

async function createNewItem(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const body = subscriptions.creation.parse(req.body);

    // calculate billing frequency
    const differenceInMonths =
      (body.nextBillingDate.getFullYear() -
        body.lastBillingDate.getFullYear()) *
        12 +
      (body.nextBillingDate.getMonth() - body.lastBillingDate.getMonth());

    if (body.lastBillingDate.getTime() > body.nextBillingDate.getTime()) {
      return res.status(400).json({
        status: 400,
        message: "Last billing date cannot be greater than next billing date",
      });
    }

    const data = await Database.subscription.create({
      data: {
        ...body,
        billingFrequencyInMonths: differenceInMonths,
      },
    });

    res.status(200).json(data);
    return;
  } catch (e) {
    next(e);
  }
}

async function deleteItem(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const id = subscriptions.id.parse(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid body parameters",
      });
    }

    const doesSubExist = await Database.subscription.findFirst({
      where: {
        id,
      },
    });
    if (!doesSubExist) {
      return res.status(404).json({
        status: 404,
        message: "No subscription found",
      });
    }

    await Database.subscription.delete({
      where: {
        id,
      },
    });

    res.status(204);
    return;
  } catch (e) {
    next(e);
  }
}

async function updateItems(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const body = subscriptions.update.parse(req.body);

    if (isNaN(body.id)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid body parameters",
      });
    }

    const sub = await Database.subscription.findFirst({
      where: {
        id: body.id,
      },
    });
    if (!sub) {
      return res.status(404).json({
        status: 404,
        message: "No subscription with that id exists",
      });
    }

    // recalculate billing frequency if billing date changed
    let updateObject = {
      billingFrequencyInMonths: sub.billingFrequencyInMonths,
      nextBillingDate: sub.nextBillingDate,
      lastBillingDate: sub.lastBillingDate,
    };
    if (body.nextBillingDate || body.lastBillingDate) {
      const nextBillingDateTime = body.nextBillingDate || sub.nextBillingDate;
      const lastBillingDateTime = body.lastBillingDate || sub.lastBillingDate;

      if (lastBillingDateTime.getTime() > nextBillingDateTime.getTime()) {
        return res.status(400).json({
          status: 400,
          message: "Last billing date cannot be greater than next billing date",
        });
      }

      updateObject.billingFrequencyInMonths =
        (nextBillingDateTime.getFullYear() -
          lastBillingDateTime.getFullYear()) *
          12 +
        (nextBillingDateTime.getMonth() - lastBillingDateTime.getMonth());

      (updateObject.nextBillingDate = nextBillingDateTime),
        (updateObject.lastBillingDate = lastBillingDateTime);
    }

    const data = await Database.subscription.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        ...req.body,
        ...updateObject,
      },
    });

    res.status(200).json(data);
    return;
  } catch (e) {
    next(e);
  }
}

async function fetchItems(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const { dateRange, q, sortBy, sortDirection, fromDate } =
      subscriptions.sortOptions.parse(req.query);

    const sortObject = {
      where: {},
      orderBy: {},
    };

    if (q) {
      sortObject.where = {
        ...sortObject.where,
        name: {
          contains: q,
        },
      };
    }
    if (dateRange) {
      const currentDate = new Date();
      const modifiedDate = new Date();

      if (dateRange === "7-days") {
        modifiedDate.setDate(modifiedDate.getDate() + 7);
      } else if (dateRange === "30-days") {
        modifiedDate.setDate(modifiedDate.getDate() + 30);
      }

      sortObject.where = {
        ...sortObject.where,
        nextBillingDate: {
          lte: modifiedDate,
          gte: currentDate,
        },
      };
    }
    if (fromDate) {
      console.log(new Date(fromDate.toISOString().split("T")[0]), fromDate);
      sortObject.where = {
        ...sortObject.where,
        nextBillingDate: new Date(fromDate),
      };
    }
    if (sortBy) {
      if (sortBy === "price") {
        sortObject.orderBy = {
          price: sortDirection || "desc",
        };
      } else {
        sortObject.orderBy = {
          nextBillingDate: sortDirection || "desc",
        };
      }
    } else {
      sortObject.orderBy = {
        nextBillingDate: "desc",
      };
    }

    const data = await Database.subscription.findMany(sortObject);
    res.status(200).json(data);
    return;
  } catch (e) {
    next(e);
  }
}

async function fetchSpecificItem(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid body parameters",
      });
    }

    const data = await Database.subscription.findFirst({
      where: {
        id,
      },
    });

    res.status(200).json(data);
    return;
  } catch (e) {
    next(e);
  }
}

async function searchForItem(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const query = subscriptions.search.parse(req.query.q);

    const data = await Database.subscription.findMany({
      where: {
        name: {
          contains: query,
        },
      },
    });

    res.status(200).json(data);
    return;
  } catch (e) {
    next(e);
  }
}

export default {
  createNewItem,
  updateItems,
  deleteItem,
  fetchItems,
  fetchSpecificItem,
  searchForItem,
};
