import { AppDispatch } from "..";
import {
  updateHighestSpending,
  updateItems,
  updateUpcomingItem,
  updateTotalSpend,
} from "../reducers/itemSlice";
import { request } from "@/lib/api";

export const hydrateItems =
  (parameters?: string) => async (dispatch: AppDispatch) => {
    try {
      let path = "items";
      if (parameters) {
        path += `?${parameters}`;
      }

      const items = await request(path, "GET", null, null);
      if (items.status) {
        dispatch(updateItems(items.body));
        dispatch(hydrateUpcomingItem());
        dispatch(hydrateTotalSpend());
      }
    } catch (error) {
      console.error("Failed to hydrate!", error);
    }
  };

export const hydrateUpcomingItem = () => async (dispatch: AppDispatch) => {
  try {
    const items = await request(
      "items?dateRange=7-days&limit=1",
      "GET",
      null,
      null
    );
    if (items.status) {
      dispatch(updateUpcomingItem(items.body[0]));
    }
  } catch (error) {
    console.error("Failed to hydrate upcoming item!", error);
  }
};

export const hydrateHighestSpendingItem =
  () => async (dispatch: AppDispatch) => {
    try {
      const items = await request(
        "items?sortBy=price&limit=1",
        "GET",
        null,
        null
      );
      if (items.status) {
        dispatch(updateHighestSpending(items.body[0]));
      }
    } catch (error) {
      console.error("Failed to hydrate upcoming item!", error);
    }
  };

export const hydrateTotalSpend = () => async (dispatch: AppDispatch) => {
  try {
    const items = await request("metrics/cpm", "GET", null, null);
    if (items.status) {
      dispatch(updateTotalSpend(items.body.totalSpend));
    }
  } catch (error) {
    console.error("Failed to hydrate upcoming item!", error);
  }
};

export const createItem =
  (item: object, date?: Date | undefined) => async (dispatch: AppDispatch) => {
    try {
      let q = "";
      if (date) {
        q = `fromDate=${date.toISOString().split("T")[0]}`;
      }

      const createdItem = await request(
        "items",
        "POST",
        {
          "content-type": "application/json",
        },
        item
      );
      if (createdItem.status) {
        dispatch(hydrateItems(q));
      }
    } catch (error) {
      console.error("Failed to create item!", error);
    }
  };
