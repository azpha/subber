import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type {
  Filters,
  SortByFilter,
  SortDirectionFilter,
  Subscription,
} from "@/lib/types";

interface ItemState {
  items: Subscription[];
  upcomingItem: Subscription | null;
  highestSpendingItem: Subscription | null;
  filters: Filters;
}
const initialState: ItemState = {
  items: [],
  upcomingItem: null,
  highestSpendingItem: null,
  filters: {
    sortBy: "none",
    sortDirection: "desc",
    dateRange: "all-subscriptions",
    q: null,
  },
};

export const itemSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    updateItems: (
      state,
      action: PayloadAction<Subscription[] | Subscription>
    ) => {
      if (Array.isArray(action.payload)) {
        state.items = action.payload;
      } else {
        const items = state.items;
        const index = items.findIndex(
          (v) => v.id === (action.payload as Subscription).id
        );

        if (index) {
          items[index] = action.payload;
        } else {
          items.push(action.payload);
        }

        state.items = items;
      }
    },
    updateUpcomingItem: (state, action: PayloadAction<Subscription>) => {
      state.upcomingItem = action.payload;
    },
    updateHighestSpending: (state, action: PayloadAction<Subscription>) => {
      state.highestSpendingItem = action.payload;
    },
    updateSearchFilter: (state, action: PayloadAction<string>) => {
      state.filters.q = action.payload;
    },
    updateDateFilter: (
      state,
      action: PayloadAction<"7-days" | "30-days" | "all-subscriptions">
    ) => {
      state.filters.dateRange = action.payload;
    },
    updateSortByFilter: (state, action: PayloadAction<SortByFilter>) => {
      state.filters.sortBy = action.payload;
    },
    updateSortDirectionFilter: (
      state,
      action: PayloadAction<SortDirectionFilter>
    ) => {
      state.filters.sortDirection = action.payload;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
});

export const {
  updateItems,
  updateUpcomingItem,
  updateHighestSpending,
  updateDateFilter,
  updateSearchFilter,
  updateSortByFilter,
  updateSortDirectionFilter,
  resetFilters,
} = itemSlice.actions;
export default itemSlice.reducer;
