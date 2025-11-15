import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useEffect } from "react";
import { hydrateUpcomingItem } from "@/store/thunks/itemThunks";
import { Card, CardContent } from "@/components/ui/card";
import LoadingCard from "./LoadingCard";

export default function Upcoming() {
  const dispatch = useAppDispatch();
  const upcomingItem = useAppSelector((state) => state.item.upcomingItem);

  useEffect(() => {
    dispatch(hydrateUpcomingItem());
  }, []);

  const methods = {
    card: "Card",
    paypal: "PayPal",
    bank: "Bank",
  };

  if (upcomingItem) {
    return (
      <Card className="dark">
        <CardContent className="space-y-2">
          <p className="text-xs opacity-50">Upcoming</p>
          <h1 className="text-2xl font-bold">{upcomingItem?.name}</h1>
          <div className="inline-block space-x-2 text-xs font-semibold opacity-85">
            <p className="inline">{methods[upcomingItem!.paymentMethod!]}</p>
            <p className="inline">·</p>
            <p className="inline">${upcomingItem?.price}</p>
            <p className="inline">·</p>
            <p className="inline">
              {new Date(
                upcomingItem?.nextBillingDate as string
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
