import { z } from "zod";

export const validSettings = z.enum([
  "discordWebhook",
  "ntfyWebhook",
  "budget",
]);
export const paymentMethod = z.enum(["card", "paypal", "bank"]);
export const sortDirection = z.enum(["desc", "asc"]);
export const dateRange = z.enum(["7-days", "30-days"]);
export const sortBy = z.enum(["price"]);
export const settings = {
  updateSettings: z.object({
    name: validSettings,
    value: z.string().min(1),
  }),
  deleteSettings: z.object({
    name: validSettings,
  }),
};
export const subscriptions = {
  search: z.string().min(1),
  id: z.coerce.number(),
  creation: z.object({
    name: z.string().min(1),
    price: z.coerce.number().multipleOf(0.01),
    paymentMethod,
    lastBillingDate: z.coerce.date(),
    nextBillingDate: z.coerce.date(),
  }),
  update: z.object({
    id: z.coerce.number(),
    name: z.string().min(1).optional(),
    price: z.coerce.number().multipleOf(0.01),
    paymentMethod: paymentMethod.optional(),
    lastBillingDate: z.coerce.date().optional(),
    nextBillingDate: z.coerce.date().optional(),
  }),
  sortOptions: z.object({
    q: z.string().min(1).optional(),
    dateRange: dateRange.optional(),
    sortBy: sortBy.optional(),
    sortDirection: sortDirection.optional(),
    fromDate: z.coerce.date().optional(),
  }),
};
