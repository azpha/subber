import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useEffect } from "react";
import { hydrateHighestSpendingItem } from "@/store/thunks/itemThunks";
import { Card, CardContent } from "@/components/ui/card";
import LoadingCard from "./LoadingCard";

export default function HighestSpending() {
  const dispatch = useAppDispatch();
  const highestSpendingItem = useAppSelector(
    (state) => state.item.highestSpendingItem
  );

  useEffect(() => {
    dispatch(hydrateHighestSpendingItem());
  }, []);

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
    return <LoadingCard />;
  }
}
