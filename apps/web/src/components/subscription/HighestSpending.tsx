import { useAppSelector } from "@/store/hooks";
import { Card, CardContent } from "@/components/ui/card";
import LoadingCard from "./LoadingCard";
import EmptyState from "./EmptyState";

export default function HighestSpending() {
  const highestSpendingItem = useAppSelector(
    (state) => state.item.highestSpendingItem
  );
  const isLoading = useAppSelector((state) => state.item.isLoading);

  const methods = {
    card: "Card",
    paypal: "PayPal",
    bank: "Bank",
  };

  if (highestSpendingItem) {
    return (
      <Card className="dark">
        <CardContent className="space-y-2">
          <p className="text-xs opacity-50">Highest Spending</p>
          <h1 className="text-2xl font-bold">{highestSpendingItem?.name}</h1>
          <div className="inline-block space-x-2 text-xs font-semibold opacity-85">
            <p className="inline">
              {methods[highestSpendingItem!.paymentMethod!]}
            </p>
            <p className="inline">·</p>
            <p className="inline">${highestSpendingItem?.price}</p>
            <p className="inline">·</p>
            <p className="inline">
              {new Date(
                highestSpendingItem?.nextBillingDate as string
              ).toLocaleDateString()}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  } else {
    if (isLoading) {
      return <LoadingCard />;
    } else {
      return <EmptyState title="HIghest Spending" />;
    }
  }
}
