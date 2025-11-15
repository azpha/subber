interface Subscription {
  id: number | null | undefined;
  name: string;
  price: string | number;
  totalSpend: number;
  paymentMethod: PaymentMethod;
  shouldNotifyExpiry: boolean;
  lastBillingDate: Date | string;
  nextBillingDate: Date | string;
  billingFrequencyInMonths: number;
}
type CreationValues = {
  name: string | null;
  price: string | null;
  paymentMethod: PaymentMethod;
};
type Settings = {
  discordWebhook: string | undefined;
  ntfyWebhook: string | undefined;
  budget: string | undefined;
};

type Response = {
  status: boolean;
  error: string | null;
};

type NotificationConfiguration = {
  discord: boolean;
  ntfy: boolean;
};

type PaymentMethod = "card" | "paypal" | "bank" | null;
type DateRangeFilter = "all-subscriptions" | "7-days" | "30-days";
type SortByFilter = "none" | "price";
type SortDirectionFilter = "none" | "desc" | "asc";
type Filters = {
  sortBy: SortByFilter;
  sortDirection: SortDirectionFilter;
  dateRange: DateRangeFilter;
  q: string | null;
};

export type {
  Subscription,
  Response,
  NotificationConfiguration,
  Filters,
  DateRangeFilter,
  SortByFilter,
  SortDirectionFilter,
  CreationValues,
  PaymentMethod,
  Settings,
};
